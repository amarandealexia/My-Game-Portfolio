const canvas=document.getElementById('canvas')
const ctx=canvas.getContext('2d') 

let isdrawing=false
canvas.addEventListener('mousedown',function(e){
    isdrawing=true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY)
})
canvas.addEventListener('mousemove', function(e)
{if (isdrawing) {
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke();
}})
canvas.addEventListener('mouseup', function(){

    isdrawing=false;
})

color=document.getElementById("color")
/*color.addEventListener('click', function()
{
    ctx.strokeStyle='red'
})*/
erase=document.getElementById("erase")
erase.addEventListener('click', function()
{
    ctx.strokeStyle='aliceblue'
})

const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function () {
    ctx.strokeStyle = colorPicker.value;


});
const brushSize = document.getElementById("brushSize");
brushSize.addEventListener("input", function () {
    ctx.lineWidth = brushSize.value;
});
