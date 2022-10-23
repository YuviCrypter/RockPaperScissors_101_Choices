const timer = ms => new Promise(res => setTimeout(res,ms))

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);

    xmlHttp.send(null);

    return;
}
var id="";
var ppoints = 0 ,cpoints =0;
function tenorCallback_search(responsetext)
{
    var response_objects = JSON.parse(responsetext);

    top_10_gifs = response_objects["results"];

    document.getElementById(`${id}`).src = top_10_gifs[0]["media"][0]["nanogif"]["url"];

    return;

}

var search_term
function grab_data(data)
{
    var apikey = "LIVDSRZULELA";
    var lmt = 3;

    search_term = data;

    var search_url = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
            apikey + "&limit=" + lmt;

    httpGetAsync(search_url,tenorCallback_search);

    return;
}


window.onload = init;
function init(){
    var elem = document.getElementById("q");
    elem.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            PlayerChoose();
            
        }
    });
}

var objects = ["Air","Airplane","Alien","Axe","Baby","Beer","Bicycle","Bird","Blood","Book","Bowl","Brain","Butter","Cage","Camera","Car","Castle","Cat","Chain","Chainsaw","Church","Cloud","Cockroach","Community","Computer","Cross","Cup","Death","Devil","Diamond","Dragon","Duck","Dynamite","Electricity","Fence","Film","Fire","Fish","Gold","Grass","Guitar","Gun","Heart","Helicopter","Home","King","Laser","Law","Lightning","Man","Math","Medusa","Money","Monkey","Moon","Mountain","Noise","Nuke","Paper","Peace","Pit","Planet","Platimum","Poison","Police","Porcupine","Power","Prayer","Prince","Princess","Queen","Quicksand","Rain","Rainbow","Robot","Rock","Satan","School","Scissors","Sky","Snake","Spider","Sponge","Sun","Sword","T.V.","Tank","Toilet","Tornado","Train","Tree","Turnip","U.F.O.","Vampire","Video Game","Vulture","Wall","Water","Whip","Wolf","Woman"];
var playerchoice;
var cpuchoice;


function autocompleteMatch(input) {
    if (input == '') {
      return [];
    }
    var reg = new RegExp(input)
    return objects.filter(function(term) {
        
        if (term.match(reg)) {
            playerchoice = term;
            
          return term;
        }
    });
  }
  
  function showResults(val) {
    res = document.getElementById("result");
    res.innerHTML = '';
    let list = '';
    let terms = autocompleteMatch(val);
    for (i=0; i<terms.length; i++) {
      list += '<li>' + terms[terms.length-i-1] + '</li>';
    }
    res.innerHTML = '<ul>' + list + '</ul>';
  }



async function PlayerChoose(){
    console.log(playerchoice);
    grab_data(playerchoice);
    id="pc";
    document.getElementById("pct").innerHTML= playerchoice;
    await timer(2000);
    CpuChoose();
}
function CpuChoose(){
    cpuchoice = objects[randomInteger(0,100)];
    grab_data(cpuchoice);
    id="oc";
    document.getElementById("oct").innerHTML= cpuchoice;
    GetResult();
}
function GetResult(){
    fetch(`https://rps101.pythonanywhere.com/api/v1/match?object_one=${playerchoice}&object_two=${cpuchoice}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.getElementById("msg").innerHTML= data.winner +" "+data.outcome+" "+data.loser+", \n"+"Winner: "+data.winner;
    if(data.winner == playerchoice){
        ppoints++;
        document.getElementById("ps").innerHTML = "Score: "+ppoints;
    }else{
        cpoints++;
        document.getElementById("os").innerHTML = "Score: "+cpoints;
    }
    });
}