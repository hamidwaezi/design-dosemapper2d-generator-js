
const dosemapper = {};

const updateVariables = function () {
    dosemapper.units = document.getElementById('dpi72').checked ? 
        document.getElementById('dpi72').value : 
        document.getElementById('dpi96').value;

    dosemapper.width=document.getElementById('widthNo').value* 10;
    dosemapper.height=document.getElementById('heightNo').value* 10;
    dosemapper.padding=document.getElementById('paddingNo').value* 10;

    dosemapper.a4Width=210 * 10;
    dosemapper.a4Height=297 * 10;
    var drawingRect={
        x:(dosemapper.a4Width - dosemapper.width - (2*dosemapper.padding) ) / 2,
        y:(dosemapper.a4Height - dosemapper.height - (2*dosemapper.padding) ) / 2,
        width:dosemapper.width+(dosemapper.padding*2),
        height:dosemapper.height+(dosemapper.padding*2),
    };
    dosemapper.drawingRect= drawingRect;
   
};




const debug = function () {
    console.info("--All the variables---")
    console.info(dosemapper)//prints all attributes of object
};

$(document).ready(function(){ 
    console.log("\t Welcome to the Generator │╵│╵│╵│╵│╵│╵│")
    //When document is loaded, call build once
    build(updateVariables)
    debug()//prints all values to browser console

    $( "#DOSEmapperParameters" ).change(function(  ) {
        //anytime anything within the form is altered, call build again
        build(updateVariables)
        debug()//prints all values to browser console
    });

});
