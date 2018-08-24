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

    //stroke color
    var stroke='';


    //fill color
    var fill='';

    //3 point variables
    var points = [];
    var i = 0;

    
    //Tracking
    var stack = [];
    
  
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

        //A setter for stroke color
        setStrokeColor: function(color){
          stroke = color;
        },

        //A setter for fill color
        setFillColor: function(color){
            fill= color;
        },

        // A getter for stroke color
        getStrokeColor: function(){

          if(stroke.length > 0){
              return stroke;
          }
              
          return this.randColor();
      },

      // A getter for fill color
      getFillColor: function(){

          if(fill.length > 0){
              return fill;
          }
              
          return this.randColor();
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

       //Draw a 3 point triangle
       setPoint: function(){

        points[i]=[];
        points[i]['x']=x;
        points[i]['y']=y;

        if(points.length>2){
            this.draw();
            console.log(points);
            i=0;
            points = [];
        }else{
            i++;
        }

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
            case 'triangle':
                this.drawTriangle();
                break;
            case '3-point':
                this.draw3Point();
                break;
            default:
                alert('Please choose a shape');
                break;
        }
        ctx.save();
        console.log(stack);
      },

        
      //Draw a rectangle
      drawRect: function() {
      //Draw some sample rectsangles
      ctx.fillStyle = this.randColor();
      ctx.strokeStyle = this.randColor();
      ctx.fillRect(x1, y1, (x2-x1),y2-y1);
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

        //Draw a path
        drawPath: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = this.randColor();
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(x, y);
          ctx.stroke();
        },


      getCanvas: function(){
        return canvas;
      },


        //Draw a Triangle
        drawTriangle: function(){
          var a = (x1-x2);
          var b = (y1-y2);
          var c = Math.sqrt(a*a + b*b);
          var d = x1+c;
          var e = y1+c;

          //Drag left to right
          if(x1>x2){
              d=x1-c;
          }

          //Drag up
          if(y1>y2){
              e=y1-c;
          }
      
          ctx.fillStyle = this.getFillColor();
          ctx.strokeStyle = this.getStrokeColor();
          ctx.beginPath();
          ctx.moveTo(x1, y1);

          ctx.lineTo(d,e);
          ctx.lineTo(x2, y2);

          ctx.lineTo(x1, y1);
          ctx.stroke();
          ctx.fill();
      },

        //Draw 3 point
        draw3Point: function(){
          ctx.strokeStyle = this.getStrokeColor();
          ctx.fillStyle = this.getFillColor();
          
          ctx.beginPath();
          
          ctx.moveTo(points[0]['x'], points[0]['y']);
          ctx.lineTo(points[1]['x'], points[1]['y']);
          ctx.lineTo(points[2]['x'], points[2]['y']);
          ctx.lineTo(points[0]['x'], points[0]['y']);
          ctx.stroke();
          ctx.fill()
          stack.push({
              'shape' : '3-point',
              'cords' : {
                  'points':points
              },
              'styles':{
                  'stroke': ctx.strokeStyle,
                  'fill': ctx.fillStyle
              }
          });
      },


      //Clear
      Clear: function(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      },
          
      //Redraw
      Redraw: function(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
  
  document.getElementById('btnCircle').addEventListener('click',function(){
    draw.setShape('circle');
  });

  document.getElementById('btnLine').addEventListener('click',function(){
    draw.setShape('line');
  });
 
  
  document.getElementById('btnPath').addEventListener('click',function(){
    draw.setShape('path');
  });

  document.getElementById('btnTriangle').addEventListener('click', function(){
    draw.setShape('triangle');
  });
  
  document.getElementById('btn3Point').addEventListener('click', function(){
      draw.setShape('3-point');
  });

  document.getElementById('btnClear').addEventListener('click', function(){
    draw.Clear();
  });

document.getElementById('btnRedraw').addEventListener('click', function(){
    draw.Redraw();
});


document.getElementById('strokeColor').addEventListener('change', function(){
    draw.setStrokeColor(document.getElementById('strokeColor').value);    
});

document.getElementById('randStrokeColor').addEventListener('change', function(){
    draw.setStart('');
});


document.getElementById('fillColor').addEventListener('change', function(){
    draw.setFillColor(document.getElementById('fillColor').value);
});   

document.getElementById('randFillColor').addEventListener('change', function(){
    draw.setStart('');
});

  //Add a mousemove listener to the canvas
  //When the mouse reports a change of position use the event data to
  //set and report the x,y position on the mouse.

  //Get the starting position
  draw.getCanvas().addEventListener('mousedown', function() {
    draw.setStart();
    draw.setIsDrawing(true);
  });
  
  //Get the ending position
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

    draw.getCanvas().addEventListener('mousedown' , function(){
      if(draw.getShape()!=='3-Point'){
      draw.setStart();
      draw.setIsDrawing(true);
      }
  });
  
  draw.getCanvas().addEventListener('mouseup' , function(){
      if(draw.getShape()!=='3-Point'){
      draw.setEnd();
      draw.draw();
      draw.setIsDrawing(false);
      }
  });
  
  draw.getCanvas().addEventListener('mouseup' , function(){
      if(draw.getShape()!=='3-Point'){
      draw.setPoint();
      }
  });

  });
  
 