import os
import re
import shutil
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from pymongo import MongoClient
from PIL import Image, UnidentifiedImageError


# ---------------------------------------------------------
# Environment
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv(
    "MONGODB_DATABASE",
    "oil-adulteration"
)
MONGODB_FEEDBACK_COLLECTION = os.getenv(
    "MONGODB_FEEDBACK_COLLECTION",
    "feedbacks"
)


# ---------------------------------------------------------
# Output directories
# ---------------------------------------------------------

RETRAINING_DATA_DIRECTORY = (
    BASE_DIR / "retraining-data"
)

DOWNLOAD_DIRECTORY = (
    RETRAINING_DATA_DIRECTORY / "approved-feedback"
)


# ---------------------------------------------------------
# Settings
# ---------------------------------------------------------

REQUEST_TIMEOUT_SECONDS = 30

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# ---------------------------------------------------------
# Utility functions
# ---------------------------------------------------------

def validate_environment():
    if not MONGODB_URI:
        raise ValueError(
            "MONGODB_URI is missing in ai/.env"
        )


def sanitize_class_name(class_name: str) -> str:
    """
    Keep class folder names safe while preserving
    underscores used by the trained model classes.
    """

    safe_name = re.sub(
        r"[^a-zA-Z0-9_-]",
        "_",
        class_name.strip()
    )

    safe_name = re.sub(
        r"_+",
        "_",
        safe_name
    )

    return safe_name


def sanitize_file_name(file_name: str) -> str:
    safe_name = re.sub(
        r"[^a-zA-Z0-9._-]",
        "_",
        file_name
    )

    safe_name = re.sub(
        r"_+",
        "_",
        safe_name
    )

    return safe_name


def get_extension_from_url(
    image_url: str
) -> str:
    parsed_url = urlparse(image_url)

    extension = Path(
        parsed_url.path
    ).suffix.lower()

    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return extension

    return ".jpg"


def build_file_name(
    feedback_document: dict,
    image_url: str
) -> str:
    feedback_id = str(
        feedback_document.get("_id")
    )

    original_file_name = (
        feedback_document.get(
            "originalFileName"
        )
        or "feedback-image"
    )

    original_path = Path(
        original_file_name
    )

    original_stem = sanitize_file_name(
        original_path.stem
    )

    original_extension = (
        original_path.suffix.lower()
    )

    if (
        original_extension
        not in ALLOWED_IMAGE_EXTENSIONS
    ):
        original_extension = (
            get_extension_from_url(image_url)
        )

    return (
        f"{feedback_id}-"
        f"{original_stem}"
        f"{original_extension}"
    )


def download_image(
    image_url: str,
    destination_path: Path
):
    response = requests.get(
        image_url,
        timeout=REQUEST_TIMEOUT_SECONDS,
        stream=True
    )

    response.raise_for_status()

    temporary_path = destination_path.with_suffix(
        destination_path.suffix + ".tmp"
    )

    with temporary_path.open("wb") as file:
        for chunk in response.iter_content(
            chunk_size=1024 * 1024
        ):
            if chunk:
                file.write(chunk)

    temporary_path.replace(destination_path)


def validate_downloaded_image(
    image_path: Path
):
    try:
        with Image.open(image_path) as image:
            image.verify()

    except (
        UnidentifiedImageError,
        OSError
    ) as error:
        image_path.unlink(
            missing_ok=True
        )

        raise ValueError(
            f"Downloaded file is not a valid image: "
            f"{image_path.name}"
        ) from error


def clear_existing_downloads():
    if DOWNLOAD_DIRECTORY.exists():
        shutil.rmtree(
            DOWNLOAD_DIRECTORY
        )

    DOWNLOAD_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )


# ---------------------------------------------------------
# MongoDB
# ---------------------------------------------------------

def get_approved_feedback():
    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=10000
    )

    try:
        client.admin.command("ping")

        database = client[
            MONGODB_DATABASE
        ]

        collection = database[
            MONGODB_FEEDBACK_COLLECTION
        ]

        feedback_cursor = collection.find(
            {
                "status": "approved",
                "imageUrl": {
                    "$exists": True,
                    "$ne": ""
                },
                "correctClass": {
                    "$exists": True,
                    "$ne": ""
                }
            }
        ).sort(
            "createdAt",
            1
        )

        return list(feedback_cursor)

    finally:
        client.close()


# ---------------------------------------------------------
# Download approved feedback
# ---------------------------------------------------------

def download_approved_feedback():
    validate_environment()

    print("Connecting to MongoDB...")

    approved_feedback = (
        get_approved_feedback()
    )

    print(
        "Approved feedback records found:",
        len(approved_feedback)
    )

    if not approved_feedback:
        print(
            "No approved feedback available."
        )

        return

    clear_existing_downloads()

    successful_downloads = 0
    failed_downloads = 0

    class_counts = {}

    for feedback in approved_feedback:
        feedback_id = str(
            feedback.get("_id")
        )

        image_url = feedback.get(
            "imageUrl"
        )

        correct_class = feedback.get(
            "correctClass"
        )

        if not image_url or not correct_class:
            print(
                f"Skipping incomplete record: "
                f"{feedback_id}"
            )

            failed_downloads += 1
            continue

        safe_class_name = (
            sanitize_class_name(
                correct_class
            )
        )

        class_directory = (
            DOWNLOAD_DIRECTORY /
            safe_class_name
        )

        class_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        file_name = build_file_name(
            feedback,
            image_url
        )

        destination_path = (
            class_directory /
            file_name
        )

        try:
            print(
                f"Downloading {feedback_id} "
                f"into {safe_class_name}..."
            )

            download_image(
                image_url,
                destination_path
            )

            validate_downloaded_image(
                destination_path
            )

            successful_downloads += 1

            class_counts[
                safe_class_name
            ] = (
                class_counts.get(
                    safe_class_name,
                    0
                ) + 1
            )

        except (
            requests.RequestException,
            ValueError,
            OSError
        ) as error:
            failed_downloads += 1

            destination_path.unlink(
                missing_ok=True
            )

            print(
                f"Failed to download "
                f"{feedback_id}: {error}"
            )

    print()
    print("Download completed")
    print(
        "Successful downloads:",
        successful_downloads
    )
    print(
        "Failed downloads:",
        failed_downloads
    )

    print()
    print("Class-wise approved images:")

    for class_name, count in sorted(
        class_counts.items()
    ):
        print(
            f"  {class_name}: {count}"
        )

    print()
    print(
        "Dataset location:",
        DOWNLOAD_DIRECTORY
    )


if __name__ == "__main__":
    download_approved_feedback()