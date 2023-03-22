const router = require("express").Router();

router.get("/ruta", async (req,res) => {
    try{
        const cows = await Animal.find({},"image.url name breeder classification_score");
        res.json(cows);
    }catch(e){
        res.end(e);
    }
})

module.exports = router;