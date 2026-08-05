




import os
import re
from pathlib import Path

import gdown
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

import os
from dotenv import load_dotenv

load_dotenv()
# ---------------------------------------------------------
# Paths and configuration
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
CLASSES_PATH = BASE_DIR / "classes.txt"

DEFAULT_MODEL_NAME = os.getenv(
    "MODEL_FILE_NAME",
    "final_purity_model1.pth",
)

GOOGLE_DRIVE_FILE_ID = os.getenv(
    "GOOGLE_DRIVE_MODEL_FILE_ID",
    "",
).strip()

GOOGLE_DRIVE_MODEL_URL = os.getenv(
    "GOOGLE_DRIVE_MODEL_URL",
    "",
).strip()

device = torch.device("cpu")


# ---------------------------------------------------------
# Google Drive model download
# ---------------------------------------------------------

def download_model_if_missing() -> Path:
    """
    Downloads the initial model only when no local model file exists.

    Recommended Render environment variable:
      GOOGLE_DRIVE_MODEL_FILE_ID=<google-drive-file-id>

    Optional:
      MODEL_FILE_NAME=final_purity_model1.pth
    """

    existing_models = list(
        BASE_DIR.glob("final_purity_model*.pth")
    )

    if existing_models:
        return BASE_DIR / DEFAULT_MODEL_NAME

    destination_path = BASE_DIR / DEFAULT_MODEL_NAME

    if GOOGLE_DRIVE_FILE_ID:
        print(
            "No local model found. Downloading model "
            "from Google Drive using file ID..."
        )

        downloaded_path = gdown.download(
            id=GOOGLE_DRIVE_FILE_ID,
            output=str(destination_path),
            quiet=False,
        )

    elif GOOGLE_DRIVE_MODEL_URL:
        print(
            "No local model found. Downloading model "
            "from Google Drive URL..."
        )

        downloaded_path = gdown.download(
            url=GOOGLE_DRIVE_MODEL_URL,
            output=str(destination_path),
            quiet=False,
            fuzzy=True,
        )

    else:
        raise FileNotFoundError(
            "No model file was found and Google Drive "
            "configuration is missing. Set "
            "GOOGLE_DRIVE_MODEL_FILE_ID or "
            "GOOGLE_DRIVE_MODEL_URL."
        )

    if not downloaded_path or not destination_path.exists():
        raise RuntimeError(
            "Google Drive model download failed."
        )

    print(
        f"Model downloaded successfully: "
        f"{destination_path.name}"
    )

    return destination_path


# ---------------------------------------------------------
# Model version helpers
# ---------------------------------------------------------

def get_model_version(model_path: Path) -> int:
    name = model_path.stem.lower()

    version_match = re.search(
        r"_v(\d+)$",
        name,
    )

    if version_match:
        return int(version_match.group(1))

    original_match = re.search(
        r"model(\d+)$",
        name,
    )

    if original_match:
        return int(original_match.group(1))

    return 0


def get_latest_model_path() -> Path:
    download_model_if_missing()

    model_files = list(
        BASE_DIR.glob("final_purity_model*.pth")
    )

    if not model_files:
        raise FileNotFoundError(
            f"No model file found in: {BASE_DIR}"
        )

    latest_model = max(
        model_files,
        key=lambda path: (
            get_model_version(path),
            path.stat().st_mtime,
        ),
    )

    print(
        f"Selected model: {latest_model.name}"
    )

    return latest_model


MODEL_PATH = get_latest_model_path()


# ---------------------------------------------------------
# Load classes
# ---------------------------------------------------------

def load_classes():
    if not CLASSES_PATH.exists():
        raise FileNotFoundError(
            f"classes.txt file not found: "
            f"{CLASSES_PATH}"
        )

    content = CLASSES_PATH.read_text(
        encoding="utf-8"
    ).strip()

    if not content:
        raise ValueError(
            "classes.txt file is empty"
        )

    content = content.replace("\n", ",")

    classes = [
        class_name.strip()
        for class_name in content.split(",")
        if class_name.strip()
    ]

    if not classes:
        raise ValueError(
            "No valid class names found in classes.txt"
        )

    return classes


class_names = load_classes()
num_classes = len(class_names)

print(
    f"Total classes found: {num_classes}"
)


# ---------------------------------------------------------
# Build and load model
# ---------------------------------------------------------

def build_model():
    with torch.device("meta"):
        model = models.vit_b_16(
            weights=None
        )

        input_features = (
            model.heads.head.in_features
        )

        model.heads.head = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(
                input_features,
                num_classes,
            ),
        )

    return model


def load_model():
    print("Loading model weights...")

    try:
        state_dict = torch.load(
            MODEL_PATH,
            map_location="cpu",
            weights_only=True,
            mmap=True,
        )

        if (
            isinstance(state_dict, dict)
            and "state_dict" in state_dict
        ):
            state_dict = state_dict["state_dict"]

        model = build_model()

        model.load_state_dict(
            state_dict,
            assign=True,
        )

        model.eval()

        print("Model loaded successfully")
        print(f"Model device: {device}")
        print(
            f"Model output classes: {num_classes}"
        )

        return model

    except RuntimeError as error:
        raise RuntimeError(
            "The model could not be loaded. "
            "Possible causes are insufficient memory "
            "or a mismatch between the model architecture "
            "and weights. Run Uvicorn without --reload."
        ) from error


model = load_model()


# ---------------------------------------------------------
# Image preprocessing
# ---------------------------------------------------------

image_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


# ---------------------------------------------------------
# Result formatting
# ---------------------------------------------------------

def get_oil_status(predicted_class: str):
    lower_name = predicted_class.lower()

    if lower_name.startswith("pure_"):
        oil_name = predicted_class.replace(
            "Pure_",
            "",
            1,
        )

        return {
            "status": "Pure",
            "oilType": oil_name,
            "details": f"Pure {oil_name} Oil",
            "adulterationPercentage": 0,
        }

    numbers = re.findall(
        r"\d+",
        predicted_class,
    )

    if numbers:
        percentage = int(numbers[0])
        oil_name = predicted_class.split("_")[0]

        return {
            "status": "Adulterated",
            "oilType": oil_name,
            "details": (
                f"{oil_name} oil contains "
                f"{percentage}% Palm Oil"
            ),
            "adulterationPercentage": percentage,
        }

    if any(
        word in lower_name
        for word in [
            "palm",
            "adulterated",
            "impure",
        ]
    ):
        return {
            "status": "Adulterated",
            "oilType": None,
            "details": "Adulterated Oil",
            "adulterationPercentage": None,
        }

    return {
        "status": "Unknown",
        "oilType": None,
        "details": (
            "Unable to determine purity status"
        ),
        "adulterationPercentage": None,
    }


# ---------------------------------------------------------
# Prediction
# ---------------------------------------------------------

def predict_image(image: Image.Image):
    if image is None:
        raise ValueError(
            "Image is required for prediction"
        )

    input_tensor = (
        image_transform(
            image.convert("RGB")
        )
        .unsqueeze(0)
        .to(device)
    )

    with torch.inference_mode():
        output = model(input_tensor)

        probabilities = F.softmax(
            output,
            dim=1,
        )[0]

    confidence, predicted_index = torch.max(
        probabilities,
        dim=0,
    )

    predicted_class = class_names[
        predicted_index.item()
    ]

    status_result = get_oil_status(
        predicted_class
    )

    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=min(3, len(class_names)),
    )

    top_predictions = [
        {
            "className": (
                class_names[index.item()]
            ),
            "confidence": round(
                probability.item() * 100,
                2,
            ),
        }
        for probability, index in zip(
            top_probabilities,
            top_indices,
        )
    ]

    return {
        "predictedClass": predicted_class,
        "status": status_result["status"],
        "oilType": status_result["oilType"],
        "details": status_result["details"],
        "adulterationPercentage": (
            status_result[
                "adulterationPercentage"
            ]
        ),
        "confidence": round(
            confidence.item() * 100,
            2,
        ),
        "topPredictions": top_predictions,
        "modelVersion": MODEL_PATH.name,
    }
