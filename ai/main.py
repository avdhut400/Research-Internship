# import io

# from fastapi import FastAPI
# from fastapi import File
# from fastapi import HTTPException
# from fastapi import UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from PIL import Image
# from PIL import UnidentifiedImageError

# from model_loader import class_names
# from model_loader import device
# from model_loader import predict_image


# app = FastAPI(
#     title="Oil Adulteration Prediction API",
#     description=(
#         "Vision Transformer API for detecting "
#         "oil adulteration"
#     ),
#     version="1.0.0"
# )


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://localhost:3000"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )


# ALLOWED_CONTENT_TYPES = {
#     "image/jpeg",
#     "image/jpg",
#     "image/png",
#     "image/webp"
# }


# @app.get("/")
# def home():
#     return {
#         "success": True,
#         "message": (
#             "Oil Adulteration AI API is running"
#         ),
#         "model": "Vision Transformer ViT-B/16",
#         "device": str(device),
#         "numberOfClasses": len(class_names)
#     }


# @app.get("/classes")
# def get_classes():
#     return {
#         "success": True,
#         "count": len(class_names),
#         "classes": class_names
#     }


# @app.post("/predict")
# async def predict(
#     file: UploadFile = File(...)
# ):
#     if file.content_type not in ALLOWED_CONTENT_TYPES:
#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Only JPG, JPEG, PNG and WEBP "
#                 "images are allowed"
#             )
#         )

#     try:
#         image_bytes = await file.read()

#         if not image_bytes:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Uploaded image is empty"
#             )

#         image = Image.open(
#             io.BytesIO(image_bytes)
#         )

#         prediction = predict_image(image)

#         return {
#             "success": True,
#             "fileName": file.filename,
#             **prediction
#         }

#     except UnidentifiedImageError:
#         raise HTTPException(
#             status_code=400,
#             detail="Invalid or corrupted image file"
#         )

#     except HTTPException:
#         raise

#     except Exception as error:
#         print(
#             "Prediction error:",
#             str(error)
#         )

#         raise HTTPException(
#             status_code=500,
#             detail="Prediction failed"
#         )


import io
import os

from fastapi import FastAPI
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from PIL import UnidentifiedImageError

from model_loader import MODEL_PATH
from model_loader import class_names
from model_loader import device
from model_loader import predict_image


app = FastAPI(
    title="Oil Adulteration Prediction API",
    description=(
        "Vision Transformer API for detecting "
        "oil adulteration"
    ),
    version="1.0.0",
)


def get_allowed_origins():
    configured_origins = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000",
    )

    return [
        origin.strip()
        for origin in configured_origins.split(",")
        if origin.strip()
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024


@app.get("/")
def home():
    return {
        "success": True,
        "message": (
            "Oil Adulteration AI API is running"
        ),
        "model": "Vision Transformer ViT-B/16",
        "modelVersion": MODEL_PATH.name,
        "device": str(device),
        "numberOfClasses": len(class_names),
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
        "modelLoaded": True,
        "modelVersion": MODEL_PATH.name,
    }


@app.get("/classes")
def get_classes():
    return {
        "success": True,
        "count": len(class_names),
        "classes": class_names,
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
):
    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG, PNG and WEBP "
                "images are allowed"
            ),
        )

    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty",
            )

        if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Image size must not exceed 10 MB"
                ),
            )

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        prediction = predict_image(image)

        return {
            "success": True,
            "fileName": file.filename,
            **prediction,
        }

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid or corrupted image file"
            ),
        )

    except HTTPException:
        raise

    except Exception as error:
        print(
            "Prediction error:",
            str(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Prediction failed",
        ) from error

    finally:
        await file.close()