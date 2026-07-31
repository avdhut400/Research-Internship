# import copy
# import os
# from pathlib import Path

# import torch
# import torch.nn as nn
# from torch.utils.data import ConcatDataset
# from torch.utils.data import DataLoader
# from torchvision import datasets
# from torchvision import models
# from torchvision import transforms


# # ---------------------------------------------------------
# # Paths
# # ---------------------------------------------------------

# BASE_DIR = Path(__file__).resolve().parent

# MODEL_PATH = (
#     BASE_DIR / "final_purity_model.pth"
# )

# NEW_MODEL_PATH = (
#     BASE_DIR / "final_purity_model_v2.pth"
# )

# CLASSES_PATH = (
#     BASE_DIR / "classes.txt"
# )

# APPROVED_FEEDBACK_PATH = (
#     BASE_DIR
#     / "retraining-data"
#     / "approved-feedback"
# )


# ORIGINAL_DATASET_PATH = Path(
#     r"E:\Oil-Adulteration-MERN-Structure\dataset\train"
# )


# # ---------------------------------------------------------
# # Training settings
# # ---------------------------------------------------------

# BATCH_SIZE = 4
# EPOCHS = 3
# LEARNING_RATE = 0.00001
# NUM_WORKERS = 0

# device = torch.device(
#     "cuda" if torch.cuda.is_available() else "cpu"
# )


# # ---------------------------------------------------------
# # Load class names
# # ---------------------------------------------------------

# def load_class_names():
#     if not CLASSES_PATH.exists():
#         raise FileNotFoundError(
#             f"classes.txt not found: {CLASSES_PATH}"
#         )

#     content = CLASSES_PATH.read_text(
#         encoding="utf-8"
#     ).strip()

#     content = content.replace("\n", ",")

#     class_names = [
#         class_name.strip()
#         for class_name in content.split(",")
#         if class_name.strip()
#     ]

#     if not class_names:
#         raise ValueError(
#             "No classes found in classes.txt"
#         )

#     return class_names


# class_names = load_class_names()
# num_classes = len(class_names)


# # ---------------------------------------------------------
# # Image transforms
# # ---------------------------------------------------------

# train_transform = transforms.Compose([
#     transforms.Resize(256),

#     transforms.RandomResizedCrop(
#         224,
#         scale=(0.85, 1.0)
#     ),

#     transforms.RandomHorizontalFlip(
#         p=0.5
#     ),

#     transforms.RandomRotation(
#         degrees=5
#     ),

#     transforms.ColorJitter(
#         brightness=0.1,
#         contrast=0.1,
#         saturation=0.1
#     ),

#     transforms.ToTensor(),

#     transforms.Normalize(
#         mean=[
#             0.485,
#             0.456,
#             0.406
#         ],
#         std=[
#             0.229,
#             0.224,
#             0.225
#         ]
#     )
# ])


# # ---------------------------------------------------------
# # Create datasets
# # ---------------------------------------------------------

# def create_datasets():
#     if not ORIGINAL_DATASET_PATH.exists():
#         raise FileNotFoundError(
#             "Original dataset path not found: "
#             f"{ORIGINAL_DATASET_PATH}"
#         )

#     if not APPROVED_FEEDBACK_PATH.exists():
#         raise FileNotFoundError(
#             "Approved feedback dataset not found: "
#             f"{APPROVED_FEEDBACK_PATH}"
#         )

#     print(
#         "Loading original dataset:",
#         ORIGINAL_DATASET_PATH
#     )

#     original_dataset = datasets.ImageFolder(
#         root=ORIGINAL_DATASET_PATH,
#         transform=train_transform
#     )

#     print(
#         "Original dataset classes:",
#         original_dataset.classes
#     )

#     if original_dataset.classes != class_names:
#         raise ValueError(
#             "Original dataset class order does not "
#             "match classes.txt.\n"
#             f"Dataset classes: {original_dataset.classes}\n"
#             f"classes.txt: {class_names}"
#         )

#     print(
#         "Loading approved feedback dataset:",
#         APPROVED_FEEDBACK_PATH
#     )

#     feedback_dataset = datasets.ImageFolder(
#         root=APPROVED_FEEDBACK_PATH,
#         transform=train_transform
#     )

#     print(
#         "Approved feedback classes:",
#         feedback_dataset.classes
#     )

#     return original_dataset, feedback_dataset


# # ---------------------------------------------------------
# # Remap feedback class indexes
# # ---------------------------------------------------------

# class RemappedFeedbackDataset(
#     torch.utils.data.Dataset
# ):
#     def __init__(
#         self,
#         feedback_dataset,
#         complete_class_names
#     ):
#         self.feedback_dataset = feedback_dataset

#         self.complete_class_names = (
#             complete_class_names
#         )

#         self.class_to_global_index = {
#             class_name: index
#             for index, class_name
#             in enumerate(
#                 complete_class_names
#             )
#         }

#     def __len__(self):
#         return len(
#             self.feedback_dataset
#         )

#     def __getitem__(self, index):
#         image, local_class_index = (
#             self.feedback_dataset[index]
#         )

#         local_class_name = (
#             self.feedback_dataset.classes[
#                 local_class_index
#             ]
#         )

#         if (
#             local_class_name
#             not in self.class_to_global_index
#         ):
#             raise ValueError(
#                 "Unknown feedback class: "
#                 f"{local_class_name}"
#             )

#         global_class_index = (
#             self.class_to_global_index[
#                 local_class_name
#             ]
#         )

#         return image, global_class_index


# # ---------------------------------------------------------
# # Load model
# # ---------------------------------------------------------

# def load_existing_model():
#     if not MODEL_PATH.exists():
#         raise FileNotFoundError(
#             f"Model file not found: {MODEL_PATH}"
#         )

#     print("Loading existing ViT model...")

#     model = models.vit_b_16(
#         weights=None
#     )

#     input_features = (
#         model.heads.head.in_features
#     )

#     model.heads.head = nn.Sequential(
#         nn.Dropout(p=0.4),

#         nn.Linear(
#             input_features,
#             num_classes
#         )
#     )

#     state_dict = torch.load(
#         MODEL_PATH,
#         map_location="cpu",
#         weights_only=True
#     )

#     model.load_state_dict(
#         state_dict
#     )

#     model = model.to(device)

#     return model


# # ---------------------------------------------------------
# # Freeze most model layers
# # ---------------------------------------------------------

# def freeze_model_layers(model):
#     for parameter in model.parameters():
#         parameter.requires_grad = False

#     # Classifier head train करतो
#     for parameter in (
#         model.heads.parameters()
#     ):
#         parameter.requires_grad = True

   
#     for parameter in (
#         model.encoder.layers[-1].parameters()
#     ):
#         parameter.requires_grad = True


# # ---------------------------------------------------------
# # Train model
# # ---------------------------------------------------------

# def train_model():
#     print("Device:", device)
#     print("Classes:", num_classes)

#     original_dataset, feedback_dataset = (
#         create_datasets()
#     )

#     remapped_feedback_dataset = (
#         RemappedFeedbackDataset(
#             feedback_dataset,
#             class_names
#         )
#     )

#     combined_dataset = ConcatDataset([
#         original_dataset,
#         remapped_feedback_dataset
#     ])

#     print(
#         "Original images:",
#         len(original_dataset)
#     )

#     print(
#         "Approved feedback images:",
#         len(feedback_dataset)
#     )

#     print(
#         "Combined images:",
#         len(combined_dataset)
#     )

#     data_loader = DataLoader(
#         combined_dataset,
#         batch_size=BATCH_SIZE,
#         shuffle=True,
#         num_workers=NUM_WORKERS,
#         pin_memory=(
#             device.type == "cuda"
#         )
#     )

#     model = load_existing_model()

#     freeze_model_layers(model)

#     trainable_parameters = [
#         parameter
#         for parameter in model.parameters()
#         if parameter.requires_grad
#     ]

#     optimizer = torch.optim.AdamW(
#         trainable_parameters,
#         lr=LEARNING_RATE,
#         weight_decay=0.01
#     )

#     criterion = nn.CrossEntropyLoss()

#     best_model_state = copy.deepcopy(
#         model.state_dict()
#     )

#     best_loss = float("inf")

#     for epoch in range(EPOCHS):
#         model.train()

#         running_loss = 0.0
#         correct_predictions = 0
#         total_predictions = 0

#         print()
#         print(
#             f"Epoch {epoch + 1}/{EPOCHS}"
#         )

#         for batch_index, (
#             images,
#             labels
#         ) in enumerate(data_loader):
#             images = images.to(device)
#             labels = labels.to(device)

#             optimizer.zero_grad()

#             outputs = model(images)

#             loss = criterion(
#                 outputs,
#                 labels
#             )

#             loss.backward()

#             optimizer.step()

#             running_loss += (
#                 loss.item()
#                 * images.size(0)
#             )

#             predictions = outputs.argmax(
#                 dim=1
#             )

#             correct_predictions += (
#                 predictions
#                 .eq(labels)
#                 .sum()
#                 .item()
#             )

#             total_predictions += (
#                 labels.size(0)
#             )

#             print(
#                 f"Batch "
#                 f"{batch_index + 1}/"
#                 f"{len(data_loader)} "
#                 f"- Loss: "
#                 f"{loss.item():.4f}"
#             )

#         epoch_loss = (
#             running_loss
#             / len(combined_dataset)
#         )

#         epoch_accuracy = (
#             correct_predictions
#             / total_predictions
#         ) * 100

#         print(
#             f"Epoch Loss: "
#             f"{epoch_loss:.4f}"
#         )

#         print(
#             f"Training Accuracy: "
#             f"{epoch_accuracy:.2f}%"
#         )

#         if epoch_loss < best_loss:
#             best_loss = epoch_loss

#             best_model_state = copy.deepcopy(
#                 model.state_dict()
#             )

#             print(
#                 "Best model updated"
#             )

#     model.load_state_dict(
#         best_model_state
#     )

#     torch.save(
#         model.state_dict(),
#         NEW_MODEL_PATH
#     )

#     print()
#     print("Retraining completed")
#     print(
#         "New model saved at:",
#         NEW_MODEL_PATH
#     )


# if __name__ == "__main__":
#     train_model()


























import copy
import re
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import ConcatDataset, DataLoader
from torchvision import datasets, models, transforms

BASE_DIR = Path(__file__).resolve().parent
CLASSES_PATH = BASE_DIR / "classes.txt"
APPROVED_FEEDBACK_PATH = BASE_DIR / "retraining-data" / "approved-feedback"
ORIGINAL_DATASET_PATH = Path(r"E:\Oil-Adulteration-MERN-Structure\dataset\train")

BATCH_SIZE = 2
EPOCHS = 1
LEARNING_RATE = 0.00001
NUM_WORKERS = 0

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_model_version(model_path: Path) -> int:
    name = model_path.stem.lower()
    version_match = re.search(r"_v(\d+)$", name)
    if version_match:
        return int(version_match.group(1))

    original_match = re.search(r"model(\d+)$", name)
    if original_match:
        return int(original_match.group(1))

    return 0


def get_latest_model_path() -> Path:
    model_files = list(BASE_DIR.glob("final_purity_model*.pth"))
    if not model_files:
        raise FileNotFoundError(f"No trained model found in: {BASE_DIR}")

    return max(
        model_files,
        key=lambda path: (get_model_version(path), path.stat().st_mtime),
    )


def get_next_model_path(latest_model_path: Path) -> Path:
    current_version = max(get_model_version(latest_model_path), 1)
    return BASE_DIR / f"final_purity_model_v{current_version + 1}.pth"


MODEL_PATH = get_latest_model_path()
NEW_MODEL_PATH = get_next_model_path(MODEL_PATH)

print(f"Training from: {MODEL_PATH.name}")
print(f"Saving as: {NEW_MODEL_PATH.name}")


def load_class_names():
    if not CLASSES_PATH.exists():
        raise FileNotFoundError(f"classes.txt not found: {CLASSES_PATH}")

    content = CLASSES_PATH.read_text(encoding="utf-8").strip().replace("\n", ",")
    class_names = [name.strip() for name in content.split(",") if name.strip()]

    if not class_names:
        raise ValueError("No classes found in classes.txt")

    return class_names


class_names = load_class_names()
num_classes = len(class_names)

train_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.RandomResizedCrop(224, scale=(0.85, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=5),
    transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


def validate_original_dataset(dataset):
    missing = [name for name in class_names if name not in dataset.class_to_idx]
    extra = [name for name in dataset.classes if name not in class_names]

    if missing or extra:
        raise ValueError(
            "Original dataset classes do not match classes.txt.\n"
            f"Missing classes: {missing}\n"
            f"Extra classes: {extra}"
        )


class RemappedImageFolder(torch.utils.data.Dataset):
    def __init__(self, image_folder, complete_class_names):
        self.image_folder = image_folder
        self.class_to_global_index = {
            class_name: index for index, class_name in enumerate(complete_class_names)
        }

    def __len__(self):
        return len(self.image_folder)

    def __getitem__(self, index):
        image, local_index = self.image_folder[index]
        class_name = self.image_folder.classes[local_index]

        if class_name not in self.class_to_global_index:
            raise ValueError(f"Unknown class found in dataset: {class_name}")

        return image, self.class_to_global_index[class_name]


def create_datasets():
    if not ORIGINAL_DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Original dataset path not found: {ORIGINAL_DATASET_PATH}"
        )

    if not APPROVED_FEEDBACK_PATH.exists():
        raise FileNotFoundError(
            f"Approved feedback dataset not found: {APPROVED_FEEDBACK_PATH}"
        )

    print(f"Loading original dataset: {ORIGINAL_DATASET_PATH}")
    original_dataset = datasets.ImageFolder(
        root=ORIGINAL_DATASET_PATH,
        transform=train_transform,
    )
    validate_original_dataset(original_dataset)

    print(f"Loading approved feedback dataset: {APPROVED_FEEDBACK_PATH}")
    feedback_dataset = datasets.ImageFolder(
        root=APPROVED_FEEDBACK_PATH,
        transform=train_transform,
    )

    return original_dataset, feedback_dataset


def build_model():
    model = models.vit_b_16(weights=None)
    input_features = model.heads.head.in_features
    model.heads.head = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(input_features, num_classes),
    )
    return model


def load_existing_model():
    print(f"Loading existing ViT model: {MODEL_PATH.name}")
    model = build_model()

    state_dict = torch.load(
        MODEL_PATH,
        map_location="cpu",
        weights_only=True,
    )

    if isinstance(state_dict, dict) and "state_dict" in state_dict:
        state_dict = state_dict["state_dict"]

    model.load_state_dict(state_dict)
    return model.to(device)


def freeze_model_layers(model):
    for parameter in model.parameters():
        parameter.requires_grad = False

    for parameter in model.heads.parameters():
        parameter.requires_grad = True

    for parameter in model.encoder.layers[-1].parameters():
        parameter.requires_grad = True


def train_model():
    print(f"Device: {device}")
    print(f"Classes: {num_classes}")

    original_dataset, feedback_dataset = create_datasets()

    combined_dataset = ConcatDataset([
        RemappedImageFolder(original_dataset, class_names),
        RemappedImageFolder(feedback_dataset, class_names),
    ])

    if len(combined_dataset) == 0:
        raise ValueError("The combined training dataset is empty")

    print(f"Original images: {len(original_dataset)}")
    print(f"Approved feedback images: {len(feedback_dataset)}")
    print(f"Combined images: {len(combined_dataset)}")

    loader = DataLoader(
        combined_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=NUM_WORKERS,
        pin_memory=device.type == "cuda",
    )

    model = load_existing_model()
    freeze_model_layers(model)

    optimizer = torch.optim.AdamW(
        [p for p in model.parameters() if p.requires_grad],
        lr=LEARNING_RATE,
        weight_decay=0.01,
    )
    criterion = nn.CrossEntropyLoss()

    best_model_state = copy.deepcopy(model.state_dict())
    best_loss = float("inf")

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        correct_predictions = 0
        total_predictions = 0

        print(f"\nEpoch {epoch + 1}/{EPOCHS}")

        for batch_index, (images, labels) in enumerate(loader):
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            predictions = outputs.argmax(dim=1)
            correct_predictions += predictions.eq(labels).sum().item()
            total_predictions += labels.size(0)

            print(
                f"Batch {batch_index + 1}/{len(loader)} - Loss: {loss.item():.4f}"
            )

        epoch_loss = running_loss / len(combined_dataset)
        epoch_accuracy = (correct_predictions / total_predictions) * 100

        print(f"Epoch Loss: {epoch_loss:.4f}")
        print(f"Training Accuracy: {epoch_accuracy:.2f}%")

        if epoch_loss < best_loss:
            best_loss = epoch_loss
            best_model_state = copy.deepcopy(model.state_dict())
            print("Best model updated")

    model.load_state_dict(best_model_state)
    torch.save(model.state_dict(), NEW_MODEL_PATH)

    print("\nRetraining completed")
    print(f"New model saved at: {NEW_MODEL_PATH}")


if __name__ == "__main__":
    train_model()
