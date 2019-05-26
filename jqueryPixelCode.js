$(document).ready(function(){


    let timer;
    let count = 0;
    let square = 0;
    let finalCoords = [0];
    
    
    function findNearestSquare(){
                            let mousePos = getMousePos(canvas, event);
                            let finalX;
                            let finalY;
                            for(i = 0; i<=rowSeparations.length;i++){
                                if(mousePos.x == rowSeparations[i]){
                                    finalX = mousePos.x;
                                    finalCoords[1]=finalX;
                                }
                                else if(mousePos.x < rowSeparations[i]){
                                    finalX = rowSeparations[i-1];
                                    finalCoords[1]=finalX;
                                    break;
                                }
                                else if(mousePos.x>rowSeparations[rowSeparations.length-1]){
                                    finalX = rowSeparations[(rowSeparations.length)-1];
                                    finalCoords[1]=finalX;
                                    break;
                                }
                            }
                            for(i = 0; i<=rowSeparations.length;i++){
                                if(mousePos.y == rowSeparations[i]){
                                finalY = mousePos.y;
                                finalCoords[2]=finalY;
                            }
                            else if(mousePos.y < rowSeparations[i]){
                                finalY = rowSeparations[i-1];
                                finalCoords[2]=finalY;
                                break;
                            }
                            else if(mousePos.y> rowSeparations[rowSeparations.length-1]){
                                finalY = rowSeparations[(rowSeparations.length)-1];
                                finalCoords[2]=finalY;
                                break;
                            }
                        }
                        return{
                            finalCoords
                        };
    }
    
    
    $("canvas").mousedown(()=>{
        timer = setInterval(100);
        timer=setInterval(()=>{
            canvas.innerHTML = count++;
        }, 100);
        $(this).mousemove(()=>{
                            let sizeSelector = document.getElementById("sizeOfGrid").value;
                            let separationForEach = (canvas.width / sizeSelector);
                            findNearestSquare();
                            square = makeSquareObject(finalCoords[1],finalCoords[2]);
                            ctx.fillStyle = document.getElementById("displaySlide").style.background;
                            ctx.fillRect(square.x,square.y,separationForEach, separationForEach);
                        });
    
                       
    });
    
    $("canvas").mouseup(()=>{
        if (timer) {
            clearInterval(timer);
        }
            $(this).unbind("mousemove");
    });
    
    
    $("canvas").dblclick(()=>{
        let sizeSelector = document.getElementById("sizeOfGrid").value;
        let separationForEach = (canvas.width / sizeSelector);
        findNearestSquare();
        square = makeSquareObject(finalCoords[1],finalCoords[2]);
        ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
        ctx.clearRect(square.x,square.y,separationForEach,separationForEach);
        ctx.fillRect(square.x,square.y,separationForEach, separationForEach);
    });    
    
    });