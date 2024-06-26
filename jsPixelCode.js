window.onload = function() {
    let canvas = document.getElementById("grid");
        let ctx = canvas.getContext("2d");
        canvas.height = (screen.height) * 0.6;
        canvas.width = canvas.height;
        let width = canvas.width;
        let img = new Image();
        let rowSeparations = [];
        let file = document.getElementById('fileSelector');
        file.addEventListener('change', selectFile, false);
        let frameCounter = 1;
        let animationData = [];
        let previousFrameData = [];
        let currentFrameData = [];

        function getImgData() {
            let rowSeparation = canvas.height / 16;
            let allPixels = [];
            //CHANGE ROWSEPARATIONS.LENGTH TO 16
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 16; j++) {
                    allPixels.push(canvas.getContext("2d").getImageData((rowSeparation * j), (rowSeparation * i), rowSeparation, rowSeparation).data);
                }
            }
            return {
                allPixels
            };
        }

        function selectFile(e) {
            let fileReader = new FileReader();
            let mLeft = ((1 - (canvas.width / screen.width)) * 50) - 1;
            canvas.style.marginLeft = mLeft.toString() + "%";
            canvas.style.marginRight = mLeft.toString() + "%";
            fileReader.onload = (event) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    previewOnCanvas();
                    ctx.globalCompositeOperation = "source-over";
                    drawGrid();
                    return img;
                }
                img.src = event.target.result;
            }
            fileReader.readAsDataURL(e.target.files[0]);
        }

        function drawImage(imagePixels) {
            let counter = 0;
            let gridWidth = canvas.width / 16;
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 16; y++) {

                    let r = imagePixels[counter];
                    let g = imagePixels[counter + 1];
                    let b = imagePixels[counter + 2];

                    counter = counter + 4;
                    drawSquare(x * gridWidth, y * gridWidth, r, g, b);
                }
            }

        }

        function drawSquare(x, y, r, g, b) {
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.fillRect(y, x, canvas.width / 16, canvas.width / 16);
        }

        function scaleImage(canvas) {
            data = getImgData(canvas).allPixels;
            imgDataData = [];

            let finalPixels = [];
            let finalPixelsNoAlpha = [];

            data = getImgData(canvas).allPixels;


            // Each array
            for (let i = 0; i < data.length; i++) {
                let cummulativePixelRed = 0;
                let cummulativePixelGreen = 0;
                let cummulativePixelBlue = 0;
                let cummulativePixelAlpha = 0;
                for (let j = 0; j < data[i].length; j++) {
                    cummulativePixelRed += data[i][j];
                    cummulativePixelGreen += data[i][j + 1];
                    cummulativePixelBlue += data[i][j + 2];
                    cummulativePixelAlpha += data[i][j + 3];
                    j = j + 3;
                }
                cummulativePixelRed = cummulativePixelRed / ((data[i].length) / 4);
                cummulativePixelGreen = cummulativePixelGreen / ((data[i].length) / 4);
                cummulativePixelBlue = cummulativePixelBlue / ((data[i].length) / 4);
                cummulativePixelAlpha = cummulativePixelAlpha / ((data[i].length) / 4);
                finalPixels.push(cummulativePixelRed);
                finalPixels.push(cummulativePixelGreen);
                finalPixels.push(cummulativePixelBlue);
                finalPixels.push(cummulativePixelAlpha);
                finalPixelsNoAlpha.push(cummulativePixelRed);
                finalPixelsNoAlpha.push(cummulativePixelGreen);
                finalPixelsNoAlpha.push(cummulativePixelBlue);
            }
            for(let i = 0; i<finalPixels.length;i++){
                finalPixels[i] = Math.round(finalPixels[i]);
            }
            for(let i = 0; i<finalPixelsNoAlpha.length;i++){
                finalPixelsNoAlpha[i] = Math.round(finalPixelsNoAlpha[i]);
            }
            return {
                finalPixels,finalPixelsNoAlpha
            };

        }

        function saveToFile() {
            let fileType = document.getElementById("typeOfFile").value;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let canvasNoLines = previewOnCanvas();
            image1Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let oldGlobalComp = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            image1 = canvas.toDataURL("image/" + fileType);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(image1Data, 0, 0);
            var tmpLink = document.createElement('a');
            tmpLink.download = 'pixelatedImage';
            tmpLink.href = image1;
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
            ctx.globalCompositeOperation = oldGlobalComp;
            drawGrid();
            return canvasNoLines;
        }

        function previewOnCanvas() {
            let scaledImage = scaleImage(canvas);
            drawImage(scaledImage.finalPixels);
            let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
            return imageData;
        }

        function makeJSON(){
            let scaledImage = scaleImage(canvas);
            scaledImage = JSON.stringify(scaledImage.finalPixelsNoAlpha);
            let name;
            let nameNoExt;
            if(document.getElementById("fileSelector").files[0] == undefined){
                nameNoExt = "filename";
            }
            else{
                name = document.getElementById("fileSelector").files[0].name;
                let extensionStart = name.indexOf('.');
                nameNoExt = name.substring(0,extensionStart);
            }
            $.ajax({
                 url:"/receivejson",
                 dataType:"json",
                 type:"POST",
                 data: {
                     name : nameNoExt,
                     data : scaledImage
                     },
                 success : (response)=> {
                    console.log('successfully got response');
                    console.log(response);
		 }
            });
        }

        function restoreGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
        }
        
        function drawGrid(){
            makeGrid();
            ctx.stroke();
        }

        function makeGrid() {
            let dimensions = document.getElementById("sizeOfGrid").value;
            canvas.style.border = "0.1em solid black";
            let mLeft = ((1 - (canvas.width / screen.width)) * 50) - 1;
            canvas.style.marginLeft = mLeft.toString() + "%";
            canvas.style.marginRight = mLeft.toString() + "%";
            let height = canvas.height;
            let width = canvas.width
            let rowSeparation = height / dimensions;
            
            for (i = 0; i < dimensions; i++) {
                let positionOfTopCornerY = rowSeparation * i;
                ctx.moveTo(0, rowSeparation * i);
                ctx.lineTo(width, rowSeparation * i);
                rowSeparations[i] = positionOfTopCornerY;
            }
            for (i = 0; i < dimensions; i++) {
                ctx.moveTo(rowSeparation * i, 0);
                ctx.lineTo(rowSeparation * i, height);
            }
            return {
                rowSeparations
            };

        }

        function saveCurrentFrame(){
            currentFrameData = [];
            currentFrameData = scaleImage(canvas).finalPixels;
        }

        function changeCurrentFrame(){
            let frameData = document.getElementById("frameAdderSelect");
            let frameToChangePos = (frameData.options[frameData.selectedIndex].index)* 1024;
            let newFrameData = scaleImage(canvas);
            for(let i = 0;i<newFrameData.finalPixels.length;i++){
                previousFrameData[frameToChangePos + i] = newFrameData.finalPixels[i];
            }
            for(let j = frameToChangePos;j<newFrameData.finalPixelsNoAlpha.length;i++){
                animationData[frameToChangePos + i] = newFrameData.finalPixels[i];
            }
        }

        function addFrame(){
            let frameAdderSelect = document.getElementById("frameAdderSelect");
            frameCounter = frameCounter + 1;
            let option = document.createElement("option");
            option.text = "Frame " + frameCounter;
            option.value = frameCounter;
            frameAdderSelect.add(option);
            frameAdderSelect.selectedIndex = option.index;
            let frameData = saveFrame();
        }

        function saveFrame(){
            let frameData = document.getElementById("frameAdderSelect");
            let currentSelection = frameData.options[frameData.selectedIndex];
            let currentSelectionDataToSend = scaleImage().finalPixelsNoAlpha;
            let currentSelectionDataToShow = scaleImage().finalPixels;
            for(let j = 0; j<currentSelectionDataToShow.length; j++){
                previousFrameData.push(currentSelectionDataToShow[j]);
            }
            for(let i = 0; i<currentSelectionDataToSend.length;i++){
                animationData.push(currentSelectionDataToSend[i]);
            }
        }

        function showFrame(){
            let frameData = document.getElementById("frameAdderSelect");
            let currentSelection = frameData.options[frameData.selectedIndex].index;
            let frameToShow = [];
            let startPosition = currentSelection * 1024;
            if(currentSelection == (frameData.length)-1){
                // frameToShow = scaleImage(canvas);
                drawImage(currentFrameData);
                drawGrid();
            }
            else{
                for(let i = startPosition; i<((startPosition)+ 1024); i++){
                    frameToShow.push(previousFrameData[i]);
                }
                //FRAME TO PUSH IS THE SCALED IMAGE NOW, JUST RE-DRAW ON THE CANVAS
                ctx.clearRect(0,0,canvas.width,canvas.height);
                drawImage(frameToShow);
                drawGrid();
            }
        }


        function makeSquareObject(xCoord, yCoord) {
            let square = { x: xCoord, y: yCoord };
            return square;
        }

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        let input = document.querySelectorAll("input");
        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener("input", function () {
                document.getElementById("red").value = document.getElementById("redSlide").value;
                document.getElementById("green").value = document.getElementById("greenSlide").value;
                document.getElementById("blue").value = document.getElementById("blueSlide").value;
                let red = document.getElementById("red").value,
                    green = document.getElementById("green").value,
                    blue = document.getElementById("blue").value;
                let display = document.getElementById("display");
                display.style.background = "rgb(" + red + ", " + green + ",  " + blue + ")";
            });
        }

        let slideInput = document.querySelectorAll("input", "type:range");
        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener("input", function () {
                let red = document.getElementById("redSlide").value,
                    green = document.getElementById("greenSlide").value,
                    blue = document.getElementById("blueSlide").value;
                let display = document.getElementById("displaySlide");
                display.style.background = "rgb(" + red + ", " + green + ",  " + blue + ")";
            });
        }
}
        