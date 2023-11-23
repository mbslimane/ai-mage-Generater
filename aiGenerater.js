const generateForm = document.querySelector(".generate-form")
const imageGallery = document.querySelector(".image-gallery")

OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index) =>{
         const imgCard = imageGallery.querySelectorAll(".img-card")[index];
         const imgElement = imgCard.querySelector("img");
         const downloadBtn = imgCard.querySelector(".download-btn")

         const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`
         imgElement.src = aiGeneratedImg;
        
         imgElement.onload = () =>{
            imgCard.classList.remove("loading")
            downloadBtn.setAttribute("href", aiGeneratedImg)
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
         }
    })
}

gnerateAiImages = async(userPrompt, imagQuantity) => {
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(imagQuantity),
                size: "512x512",
                response_format: "b64_json",
            })
        });
        if (!response.ok) throw new Error ("Failed to generate images! Please try again.")

        const {data} = await response.json();
        updateImageCard([...data])

    }catch (error){
        alert(error.message)
    }finally{
        isImageGenerating = false
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (isImageGenerating)return;
    isImageGenerating = true;

    
    const userPrompt = e.srcElement[0].value
    const imagQuantity = e.srcElement[1].value

    const imgCardMarkup = Array.from({length: imagQuantity}, () =>
        `<div class="img-card loading">
        <img src="./imgs/Spinner-1s-200px.svg" alt="">
        <a href="#" class="download-btn">
            <img src="./imgs/download-button-svgrepo-com.svg" alt="download icon">
        </a>
    </div>`).join("")
    
    imageGallery.innerHTML = imgCardMarkup;
    gnerateAiImages(userPrompt, imagQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission)