window.onload = function() {
				var tileSize = 100;
				var game = new Phaser.Game(tileSize*4,tileSize*4,Phaser.CANVAS,"",{preload:onPreload, create:onCreate});
				var fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
				var tileSprites;
				var upKey;
				var downKey;
				var leftKey;
				var rightKey;
				var colors = {
					2:0x33FF00,
					4:0x333399,
					8:0x33CCCC,
					16:0x6600FF,
					32:0x990000,
					64:0xFF0000,
					128:0xCC33FF,
					256:0xFFFF00,
					512:0xCC0099,
					1024:0x999900,
					2048:0x660033,
					4096:0xCC00CC,
					8192:0x660099,
					16384:0x9999CC,
					32768:0xCC0033,
					65536:0xCC9999
				}
                    
					var canMove=false;
					
				function onPreload() {
					game.load.image("tile", "tile.png");
				}
				
				function onCreate() {
					upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
					upKey.onDown.add(moveUp,this);
    					downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    					downKey.onDown.add(moveDown,this);
    					leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    					leftKey.onDown.add(moveLeft,this);
    					rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    					rightKey.onDown.add(moveRight,this);
					tileSprites = game.add.group();
					addTwo();
					addTwo();
				}
				
				function addTwo(){
					do{
						var randomValue = Math.floor(Math.random()*16);
					} while (fieldArray[randomValue]!=0)
					fieldArray[randomValue]=2;
					var tile = game.add.sprite(toCol(randomValue)*tileSize,toRow(randomValue)*tileSize,"tile");
					tile.pos = randomValue;
					tile.alpha=0;
					var text = game.add.text(tileSize/2,tileSize/2,"2",{font:"bold 16px Arial",align:"center"});
					text.anchor.set(0.5);
					tile.addChild(text);
					tileSprites.add(tile);
					var fadeIn = game.add.tween(tile);
					fadeIn.to({alpha:1},250);
					fadeIn.onComplete.add(function(){
						updateNumbers();
						canMove=true;
					})
					fadeIn.start();
				}
				function toRow(n){
					return Math.floor(n/4);
				}
				function toCol(n){
					return n%4;	
				}
				function updateNumbers(){
					tileSprites.forEach(function(item){
						var value = fieldArray[item.pos];
						item.getChildAt(0).text=value;
						item.tint=colors[value]
					});	
				}
				function moveLeft(){
                         if(canMove){
                              canMove=false;
                              var moved = false;
     					tileSprites.sort("x",Phaser.Group.SORT_ASCENDING);
     					tileSprites.forEach(function(item){
     						var row = toRow(item.pos);
     						var col = toCol(item.pos);
     						if(col>0){
     							var remove = false;
     							for(i=col-1;i>=0;i--){
     								if(fieldArray[row*4+i]!=0){
     									if(fieldArray[row*4+i]==fieldArray[row*4+col]){
     										remove = true;
     										i--;                                             
     									}
     									break;
     								}
     							}
     			
     							if(col!=i+1){
                                             moved=true;
                                             moveTile(item,row*4+col,row*4+i+1,remove);
     							}
     						}
     					});
     			
     					endMove(moved);
                         }
				}
				function endMove(m){
				
					if(m){
				
     					addTwo();
                         }
                         else{
						canMove=true;
					}
				}
				
				
				function moveTile(tile,from,to,remove){
                         fieldArray[to]=fieldArray[from];
                         fieldArray[from]=0;
                         tile.pos=to;
                         var movement = game.add.tween(tile);
                         movement.to({x:tileSize*(toCol(to)),y:tileSize*(toRow(to))},150);
                         if(remove){
                              fieldArray[to]*=2;
                              movement.onComplete.add(function(){
                                   tile.destroy();
                              });
                         }
                         movement.start();
                    }
                    function moveUp(){
                          if(canMove){
                              canMove=false;
                              var moved=false;
     					tileSprites.sort("y",Phaser.Group.SORT_ASCENDING);
     					tileSprites.forEach(function(item){
     						var row = toRow(item.pos);
     						var col = toCol(item.pos);
     						if(row>0){  
                                        var remove=false;
     							for(i=row-1;i>=0;i--){
     								if(fieldArray[i*4+col]!=0){
     									if(fieldArray[i*4+col]==fieldArray[row*4+col]){
     										remove = true;
     										i--;                                             
     									}
                                                  break
     								}
     							}
     							if(row!=i+1){
                                             moved=true;
                                             moveTile(item,row*4+col,(i+1)*4+col,remove);
     							}
     						}
     					});
     					endMove(moved);
                         }
				}
								
                    function moveRight(){
                          if(canMove){
                              canMove=false;
                              var moved=false;
     					tileSprites.sort("x",Phaser.Group.SORT_DESCENDING);
     					tileSprites.forEach(function(item){
     						var row = toRow(item.pos);
     						var col = toCol(item.pos);
     						if(col<3){
                                        var remove = false;
     							for(i=col+1;i<=3;i++){
     								if(fieldArray[row*4+i]!=0){
                                                  if(fieldArray[row*4+i]==fieldArray[row*4+col]){
     										remove = true;
     										i++;                                             
     									}
     									break
     								}
     							}
     							if(col!=i-1){
                                             moved=true;
     								moveTile(item,row*4+col,row*4+i-1,remove);
     							}
     						}
     					});
     					endMove(moved);
                         }
				}

                    function moveDown(){
                          if(canMove){
                              canMove=false;
                              var moved=false;
     					tileSprites.sort("y",Phaser.Group.SORT_DESCENDING);
     					tileSprites.forEach(function(item){
     						var row = toRow(item.pos);
     						var col = toCol(item.pos);
     						if(row<3){
                                        var remove = false;
     							for(i=row+1;i<=3;i++){
     								if(fieldArray[i*4+col]!=0){
     									if(fieldArray[i*4+col]==fieldArray[row*4+col]){
     										remove = true;
     										i++;                                             
     									}
                                                  break
     								}
     							}
     							if(row!=i-1){
                                             moved=true;
     								moveTile(item,row*4+col,(i-1)*4+col,remove);
     							}
     						}
     					});
     				     endMove(moved);
                         }
				}
	    		};
