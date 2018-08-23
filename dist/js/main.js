var draw = (function() {


    //Get the height and width of the main we will use this set canvas to the full
    //size of the main element.

    var main = document.querySelector('main');
    var mWidth = main.offsetWidth;
    var mHeight = main.offsetHeight;
      
    //Create the canvas
    var canvas = document.createElement("canvas");    
    
  
    //Create the context
    var ctx = canvas.getContext("2d");
  
    //Create the initial bounding rectangle
    var rect = canvas.getBoundingClientRect();
  
    //current x,y position
    var x = 0;
    var y = 0;
    
    
    //start x,y position
    var x1 = 0;
    var y1 = 0;
    
    
    //end x,y position
    var x2 = 0;
    var y2 = 0;

    //end x,y position
    var lx2 = false;
    var ly2 = false;

    //What shape are we drawing?
    shape='';

    //Do we want to draw?
    var isDrawing=false;
    
  
    return {

      setIsDrawing: function(bool){
        isDrawing=bool;
      },
      
      getIsDrawing: function(){
        return isDrawing;
      },
     
      //Get shape
      getShape: function(){
        return shape;
      },



        //Sets the shape to be drawn
        setShape: function(shp) {
        shape = shp;
        },

        
        //Set a random color
        randColor: function(){
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        },

        //set starting x,y (mouse down)
        setStart: function(){
            x1=x;
            y1=y;
        },

        //set ending x,y (mouse up)
        setEnd: function(){
            x2=x;
            y2=y;
        },


      //Set the x,y coords based on current event data
      setXY: function(evt) {

        //set the last x,y coords
        lx=x;
        ly=y;

        //Set the current x,y coords
        x = (evt.clientX - rect.left) - canvas.offsetLeft;
        y = (evt.clientY - rect.top) - canvas.offsetTop;
      },
  
      //Write the x,y coods to the target div
      writeXY: function() {
        document.getElementById('trackX').innerHTML = 'X: ' + x;
        document.getElementById('trackY').innerHTML = 'Y: ' + y;
      },
  
      //Draw a shape
      draw: function(){
        ctx.restore();  
        switch(shape){
            case 'rectangle':
                this.drawRect();
                break;
            case 'line':
                this.drawLine();
                break;
            case 'circle':
                this.drawCircle();
                break;
            case 'path':
                this.drawPath();
                break;
            default:
                alert('Please choose a shape');
                break;
        }
        ctx.save();
      },

        //Draw a Circle
        drawCircle: function() {
          ctx.strokeStyle = this.randColor();
          ctx.fillStyle = this.randColor();
          
          var a = (x1-x2);
          var b = (y1-y2);
          var radius = Math.sqrt(a*a + b*b);
          
          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2*Math.PI);
      
          ctx.stroke();
          ctx.fill();
        },

        //Draw a line
        drawLine: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = this.randColor();
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        },

        //Draw a path
        drawPath: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = this.randColor();
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(x, y);
          ctx.stroke();
        },

        //Draw a rectangle
        drawRect: function() {
        //Draw some sample rectsangles
        ctx.fillStyle = this.randColor();
        ctx.fillRect(x1, y1, (x2-x1),y2-y1);
      },
  
      getCanvas: function(){
        return canvas;
      },
  
      //Initialize the object, this must be called before anything else
      init: function() {
        canvas.width = mWidth;
        canvas.height = mHeight;
        document.querySelector('main').appendChild(canvas);
  
      }
    };
  
  })();
  
  //Initialize draw
  draw.init();

  document.getElementById('btnRect').addEventListener('click',function(){
    draw.setShape('rectangle');
  });
  

  document.getElementById('btnLine').addEventListener('click',function(){
    draw.setShape('line');
  });
 
  document.getElementById('btnCircle').addEventListener('click',function(){
    draw.setShape('circle');
  });
  
  document.getElementById('btnPath').addEventListener('click',function(){
    draw.setShape('path');
  });

  //Add a mousemove listener to the canvas
  //When the mouse reports a change of position use the event data to
  //set and report the x,y position on the mouse.

  //Get the starting position
  draw.getCanvas().addEventListener('mousedown', function() {
    draw.setStart();
    draw.setIsDrawing(true);
  });
  
  //Get the endingposition
  draw.getCanvas().addEventListener('mouseup', function() {
    draw.setEnd();
    draw.draw();
    draw.setIsDrawing(false);
  });
  
  //Track the xy positon
  draw.getCanvas().addEventListener('mousemove', function(evt) {
    draw.setXY(evt);
    draw.writeXY();

    if(draw.getShape()==='path'&& draw.getIsDrawing()===true){
      draw.draw();
    }

  });
  
 