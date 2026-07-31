const aiService =
require("../services/aiService");

exports.predict = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Image required"

            });

        }

        const result =
        await aiService.predict(

            req.file.buffer,

            req.file.originalname

        );

        res.json(result);

    }

    catch (error) {

        console.log(error.message);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};