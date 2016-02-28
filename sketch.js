var particleSystem = [];
var attractors = [];
var table1;
var table2;
var aggregated = [];
var cCategory = [];
var connections = [];



function preload(){
    table1 = loadTable("data/investments.csv","csv","header"); 
    table2 = loadTable("data/companies_categories.csv","csv","header"); 
}


function setup() {
    var canvas = createCanvas(windowWidth,windowHeight);
    
    frameRate(30);
    textAlign(CENTER);
    textSize(11);
    textFont("Futura");
    textStyle(BOLD);
    
    colorMode(HSB,360,100,100,1);
//    print(table1.getRowCount() + " total rows in table");
//    print(table2.getRowCount() + " total rows in table");
    
    for(var r=0; r<table1.getRowCount();r++){
        var comName = table1.getString(r,"company_name");// get the data from csv file  p5.Table reference
        var invested = table1.getString(r,"amount_usd");
        invested = parseInt(invested);// convert string to int number
        if(!isNaN(invested)){ // if invested is a number(if invested is not a NaN)
            if(aggregated.hasOwnProperty(comName)){
                aggregated[comName]= aggregated[comName]+invested;//create object of array =obj["company_name"] = string + string 
              
            }else{
                aggregated[comName] = invested;
            }

        }
        
    }
   
    
     for(var r=0; r<table2.getRowCount();r++){
        var comName = table2.getString(r,"name");// get the data from csv file  p5.Table reference
        var categories = table2.getString(r,"category_code");
        if(categories){ // if invested is a number(if invested is not a NaN)
                cCategory[comName] = categories;//create object of array =obj["company_name"] = string + string 
               //aggregated{comName} += invested;
//               
             }else{
                cCategory[comName] = 0;
            }
         //print(categories);

        }
         
 
   
   
    
    //lets put the object into a array
    var aAggregated = [];
    Object.keys(aggregated).forEach(function(name){ //Object.keys(object array) return a array object
        var company = {};
        company.name = name;
        company.sum = aggregated[name];
        aAggregated.push(company);
    });
    //print(aAggregated);
   var category = [];
    Object.keys(cCategory).forEach(function(name){ //Object.keys(object array) return a array object
        var company = {};
        company.name = name;
        company.category = cCategory[name];
        category.push(company);
    });
     //print(category);
    
 aAggregated.sort(function(a,b){ //array.sort -- comparason function -- number, string, object
        return b.sum -a.sum;  //sort desending order here   -- asending order a.sum - b.sum
       });
       aAggregated = aAggregated.slice(0,100);// slice the array from first to 100;
 // print(aAggregated);  
 for(var r=0; r<table2.getRowCount();r++){//second parse data
        var comName = table2.getString(r,"name");// get the data from csv file  p5.Table reference
        var categories = table2.getString(r,"category_code");
       
        
            var foundCategory = category.find(function(element, index, array){
                return element.name == comName;
            });
        if(foundCategory){
             var foundCompany = aAggregated.find(function(element, index, array){
               return element.name == comName;
            });
            if(foundCompany){
                var connection = {};
                connection.company = foundCompany;//object from aAggregated
               connection.category = foundCategory;//object from investors
                connections.push(connection);  
            }
            
        }
    
          
    }
        connections.sort(function(a,b){ //array.sort -- comparason function -- number, string, object
        return b.company.sum -a.company.sum;  //sort desending order here   -- asending order a.sum - b.sum
       });
       connections = connections.slice(0,100);// slice the array from first to 100;
    
    //print(connections);

    for(var i=0;i<connections.length;i++){
        var p = new Particles(connections[i].company.name,connections[i].company.sum,connections[i].category.category);
        particleSystem.push(p);
       
    }
    
//var ont = "0x" + 'mo';
//
//
//print(parseInt(ont,36));

   
    
    var at = new Attractor(createVector(width/2,height/2),5);
    attractors.push(at);
}


function draw() {
    
    background(10);
  
       
    for(var STEP=0; STEP <3; STEP ++){  //itteration about the collsion. 
    for(var i=0; i<particleSystem.length-1; i++){
            for(var j=i+1; j<particleSystem.length; j++){
                var pa = particleSystem[i];
                var pb = particleSystem[j];
                var ab = p5.Vector.sub(pb.position, pa.position);
                var distSq = ab.magSq();
                if(distSq <= sq(pa.radius + pb.radius)){
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap*0.5);
                    pb.position.add(ab);
                    ab.mult(-1);
                    pa.position.add(ab);
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97); // this line decrease the particle's velocity everytime the particle collision

                }
            }
        }
    }
    
    
    //createMightyParticles();
       for(var i=particleSystem.length-1;i>=0;i--){
        var p = particleSystem[i];
            p.update();
            p.draw();
    
        }
    
 


             
   attractors.forEach(function(at){
       at.draw();
       
       
   });
}



function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    
    
    
}


//create a single particle.
var Particles = function(name,sum,category){
    this.name = name;
    this.sum = sum;
    this.category = category;
    //print(this.category);
    
    var isMouseOver = false;
    
    
    this.radius = sqrt(sum)/4000;
    var H = parseInt(category[0],36);
    var S = parseInt(category[2],36);
    var B = parseInt(category[3],36);
   // var T = parseInt(category[3],36);
    
    
    //this.hue =sqrt(sqrt(sqrt(invervet)));
    //this.hue = 0;

    var initialRadius = this.radius;
    var maxR = 70;
    
    
    var tempAng = random(TWO_PI);
    this.position = createVector(cos(tempAng),sin(tempAng));
    this.position.div(this.radius);//try to put bigger one near to the center --> if the radius is high the posistion is lower
    this.position.mult(1000);
    this.position.set(this.position.x + width/2, this.position.y + height/2);//create initial position and make it center. 
    this.vel = createVector(0,0);
    var acc = createVector(0,0);
    
    this.update = function(){
        checkMouse(this);
        
        attractors.forEach(function(A){
          var att = p5.Vector.sub(A.getPos(),this.position); //if did not put this after the function(A), this here means A// 
          var distanceSq = att.magSq();
            if(distanceSq > 1 ){
                att.normalize()
                att.div(10);
                acc.add(att);
            }
        }, this);
        this.vel.add(acc);//should add this.acceleration here! if use this.velocity here, the same with velocity
        this.position.add(this.vel);
        acc.mult(0);//reset the acceraltion 
        
        
       
        
    }
    
    
    
   this.draw = function(){
       
        noStroke();
       if(isMouseOver){
           fill(100,0,100);
       }else{
         fill(H*H/5,(S+3)*6,B*(B+5)/6);  
       }
        
        ellipse(this.position.x, this.position.y,this.radius*2, this.radius*2);
       
        if(this.radius == maxR){
            
           fill(0,0,0);
            text(this.name, this.position.x,this.position.y);
            text(this.sum, this.position.x, this.position.y + 16);
            text(category, this.position.x, this.position.y + 32);
       }
   }
 

function checkMouse(instance){ // this is a pravite function inside of particles function, 'this' is nor work here
    var mousePos = createVector(mouseX,mouseY);
    if(mousePos.dist(instance.position) <= instance.radius){
        incRadius(instance);
        isMouseOver = true;
        }else{
            decRadius(instance);
            isMouseOver = false;
        }
}

function incRadius(instance){
    instance.radius +=4;
    if(instance.radius > maxR){
        instance.radius = maxR;
    }
}

function decRadius(instance){
    instance.radius -=4;
    if(instance.radius < initialRadius){
        instance.radius = initialRadius;
    }
}
}


var Attractor = function(position, s){
var pos = position.copy();
var strength = s;

this.draw = function(){
    noStroke();
    fill(0,0,0,0);
    ellipse(pos.x, pos.y,
    strength, strength);
}

this.getStrength = function(){
    return strength; //strength here is a variable.
}

this.getPos = function(){
    return pos.copy();
}
};
