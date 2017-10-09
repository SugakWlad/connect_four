var size;
var winner;
var mode = '';
var arr = [];

$('.mode').on('click', function(e){
	$(e.target).css({borderColor: 'rgb(48, 114, 255)'});
	$(e.target).css({color: 'rgb(48, 114, 255)'});
	if($(e.target).html() == 'Standard'){
		size = 7;
		winner = 4;
		arr = [[2, 13, 24, 35],[1, 12, 23, 34],[12, 23, 34, 45],[0, 11, 22, 33],[11, 22, 33, 44],[22, 33, 44, 55],[10, 21, 32, 43],[21, 32, 43, 54],[32, 43, 54, 65],[20, 31, 42, 53],[31, 42, 53, 64],[30, 41, 52, 63],[3, 12, 21, 30],[4, 13, 22, 31],[13, 22, 31, 40],[5, 14, 23, 32],[14, 23, 32, 41],[23, 32, 41, 50],[15, 24, 33, 42],[24, 33, 42, 51],[33, 42, 51, 60],[25, 43, 34, 52],[34, 43, 52, 61],[35, 44, 53, 62]];

	}else if($(e.target).html() == 'Large'){
		size = 10;
		winner = 5;
		arr = [[1, 12, 23, 34, 45],[0, 11, 22, 33, 44],[11, 22, 33, 44, 55],[10, 21, 32, 43, 54],[21, 32, 43, 54, 65],[20, 31, 42, 53, 64],[31, 42, 53, 64, 75],[30, 41, 52, 63, 74],[41, 52, 63, 74, 85],[40, 51, 62, 73, 84],[51, 62, 73, 84, 95],[50, 61, 72, 83, 94],[40, 31, 22, 13, 04],[05, 14, 23, 32, 41],[14, 23, 32, 41, 50],[15, 24, 33, 42, 51],[24, 33, 42, 51, 60],[25, 34, 43, 52, 61],[34, 43, 52, 61, 70],[35, 44, 53, 62, 71],[44, 53, 62, 71, 80],[45, 54, 63, 72, 81],[54, 63, 72, 81, 90],[55, 64, 73, 82, 91]];
	}
	if($(e.target).html() == 'Human vs Human'){
		mode = 'HH';
	}else if($(e.target).html() == 'Human vs Computer'){
		mode = 'HC';
	}
	if(size > 0 && mode.length > 0){
		setTimeout(game, 1000);
	}	
})

function game(){
	if(size == 10){
		$('.container').css({width: '1000px'});
		$('.thinking').css({width: '1000px'});
	}
	$('.container').css({display: 'flex'});
	$('.thinking').css({display: 'flex'});
	$('.hello').css({display: 'none'});
	$('body').css({backgroundColor: 'white'});
	var maybe = '';
	var circle = '';
	var player = 'green';
	var place;
	var column;
	var winnerArr = [];
	var won = false;
	var transitioning = false;
	
	for(var i = 0; i < size; i++){
		maybe += "<div class='maybe'></div>"
		for(var j = 0; j < 6; j++){
			if(i == 0){
				circle += "<div class='circle column" + i + "' id=" + j + "></div>";
			}else{
				circle += "<div class='circle column" + i + "' id=" + i + '' + j + "></div>";
			}
		}
	}

	$('.thinking').html(maybe);
	$('.container').html(circle);


	$('.maybe').on('mouseenter', function createChoice(e){
		if((mode == 'HC' && player == 'green') || mode == 'HH'){
			column = $('.maybe').index($(e.target));
			$(e.target).html("<div class='circle move'></div>");
			$('.move').addClass(player);
			$('.maybe').on('click', function (e){
				$('.maybe').css({opacity: 1});
				column = $('.maybe').index(this);
				place = findThePlace(column);
				var placeY = place.offsetTop;
				$('.move').css({transform: 'translateY(' + (placeY-78) + 'px)'});
				transitioning = true;
			})
		}
	})

	$(document).on('transitionend', function(e){
		transitioning = false;
		place.classList.add(player);
		$('.maybe').html('');
		$('.maybe').css({opacity: 0.4});
		if(!won){
			checkTheWinnerColumn();
		}
		if(!won){
			checkTheWinnerRow();
		}
		if(!won){
			checkTheWinnerDiagonal();
		}
		if(player == 'green'){
			player = 'red';
			if(mode == 'HC'){
				computerMove();
			}
		}else if(player == 'red'){
			player = 'green';
		}
	});

	$('.maybe').on('mouseleave', function(e){
		// $(e.target).css({border: 'inherit'});
		if(transitioning){
			setTimeout(function(){
				$(e.target).html('');
			}, 300)
		}else{
			$(e.target).html('');
		}
	})

	$(document).on('keydown', function(e){
		if((mode == 'HC' && player == 'green') || mode == 'HH'){
			if(e.keyCode == 37){
				if($('.move').length !== 1){
					$('.maybe').last().html("<div class='circle move'></div>");
					$('.move').addClass(player);
					column = size - 1;
				}else if($('.move').length == 1){
					$('.maybe').eq(column).html('');
					$('.maybe').eq(column - 1).html("<div class='circle move'></div>");
					$('.move').addClass(player);
					column -= 1;
				}
			}else if(e.keyCode == 39){
				if($('.move').length !== 1){
					$('.maybe').eq(0).html("<div class='circle move'></div>");
					$('.move').addClass(player);
					column = 0;
				}else if($('.move').length == 1){
					$('.maybe').eq(column).html('');
					$('.maybe').eq(column + 1).html("<div class='circle move'></div>");
					$('.move').addClass(player);
					column += 1;
				}
			}else if(e.keyCode === 40){
				makeAMove(column);
			}
		}
	})

	function computerMove(){
		if(!won){
			column = Math.floor(Math.random() * (size));
			$('.maybe').eq(column).html("<div class='circle move'></div>");
			$('.move').addClass(player);
			setTimeout(makeAMove, 700);
		}
	}

	function makeAMove(){
			$('.maybe').css({opacity: 1});
			place = findThePlace(column);
			var placeY = place.offsetTop;
			$('.move').css({transform: 'translateY(' + (placeY-78) + 'px)'});
			transitioning = true;
		}

	function findThePlace(column){

		return $('.column' + column).get().reverse().find(function(elem){
			return !elem.classList.contains('green') && !elem.classList.contains('red');
		})
	}

	function checkTheWinnerColumn(){
		var count = 0;
		for(var i = 0; i < 6; i++){
			if($('.column' + column).eq(i).hasClass(player)){
				winnerArr.push($('.column' + column).eq(i));
				count++;
				if(count == winner){
					won = true;
					victory();
				}
			}else{
				winnerArr = [];
				count = 0;
			}
		}
	}

	function checkTheWinnerRow(){
		var count = 0;
		var idNum = $(place).attr('id');
		while(idNum > 9){
			idNum -= 10;
		}
		while(idNum < size * 8.57){
			idNum += 10;
			if($('#' + idNum).hasClass(player)){
				winnerArr.push($('#' + idNum));
				count++;
				if(count == winner){
					won = true;
					victory();
				}
			}else{
				count = 0;
				winnerArr = [];
			}
		}
	}

	function checkTheWinnerDiagonal(){
		var count = 0;

		for(var i = 0; i < 24; i++){
			for(var j = 0; j < winner; j++){
				if($('#' + arr[i][j]).hasClass(player)){
					winnerArr.push($('#' + i + '' + j));
					count++;
					if(count == winner){
						won = true;
						victory();
					}
				}else{
					count = 0;
					winnerArr = [];
				}
			}
			count = 0;
			winnerArr = [];
		}
	}

	function victory(){
		$('#win').css({display: 'block'});
		$('#win').css({backgroundColor: player});
		
			setTimeout(function fn(){
				if(winner > 0){
					winner--;
					$('#win').css({display: 'none'});
					$(winnerArr[winner]).css({backgroundColor: 'gold'});
					setTimeout(fn, 600);
				}
			}, 2000)
		setTimeout(function() {window.location.reload()}, 8000);
	}
}



// заносятся в аррей при победе только в column







