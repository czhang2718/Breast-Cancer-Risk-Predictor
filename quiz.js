$(document).ready(function(){

//make current class
  $(function(){
    $('a').each(function() {
      if ($(this).prop('href') == window.location.href) {
        $(this).addClass('current');
      }
    });
  });

  //hide quesions
  $('.questionForm').hide();
  $('.res').hide();
  $('.questionForm2').hide();
  $('#results').hide();


  //show first q
  $('#q1').show();

  $('#q1 #enter').click(function(){
    var group = $('input[name=q1]:checked').val();
    $('#q1').hide();

    if(group=='a'){
      var results_pre = new Array(4);
      $('#preq1').show();
      $('.questionForm #enter').click(function(){
        current = $(this).parents('form:first').data('question');
        results_pre[current-2] = $('input[name=preq'+(current-1)+']:checked').val();
        $('.questionForm').hide();
        if(current==5){
          $('#res').show();  }
        else{
          $('#preq'+current+'').show();  }
        return false;
      })
      $('.questionForm #res1').click(function(){
        current = $(this).parents('form:first').data('question');
        results_pre[current-2] = $('input[name=preq'+(current-1)+']:checked').val();
        $('.questionForm').hide();
        $('#container_head').hide();
        $('.main').hide();
        process1(results_pre);
        $('#results').show();
        return false;
      })
    }


    if(group=='b'){
      var results_post = new Array(11);
      $('#postq1').show();
      $('.questionForm2 #enter').click(function(){
        current = $(this).parents('form:first').data('question')-6;
        results_post[current] = $('input[name=postq'+(current+1)+']:checked').val();
        console.log(results_post);
        $('.questionForm2').hide();
        if(current==11){
          $('#res2').show();  }
        else{
          $('#postq'+(current+2)+'').show();  }
        return false;
      })
      $('.questionForm2 #res2').click(function(){
        results_post[10] = $('input[name=postq11]:checked').val();
        console.log(results_post);
        $('.questionForm2').hide();
        $('#container_head').hide();

        $('.main').hide();
        process2(results_post);
        $('#results').show();
        return false;
      })
    }
    return false;
  })

//EVALUATE RESULTS-----------------------------------------------------------------
// returns index of value in sorted array
function sortedIndex(array, value) {
    var low = 1,
        high = array.length;
    while (low < high) {
        var mid = (low + high) >>> 1;
        if (parseFloat(array[mid]) < value) low = mid + 1;
        else high = mid;
    }
    return low;
}

//returns the expit of an expression
function expit(expr){
  return Math.exp(expr)/(1+Math.exp(expr));
}


//processes result for premeno women; calculates risk, confidence interval, and creates graph
function process1(results_pre){
  //find risk
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  console.log("here1");
  console.table(results_pre);
  var coef_pre = [-7.4979, 0.2046, 0.6388, 0.8574, 0, 0.3873, -0.1431, 0, 0.4306, 0.7455,  -0.1134, 0, 0.6918, 1.2067, 1.3694, 1.1966];
  var x =new Array();
  for(i=1; i<=coef_pre.length; i++){
    x.push(0);
  }
  var numchoices = [4, 3, 4];
  var pos = 0;
  for(i=0; i<4; i++){
    if(i == 0){
      x[alphabet.indexOf(results_pre[i])] = 1;
       }
    else{
      pos += numchoices[i-1];
      x[alphabet.indexOf(results_pre[i])+pos] = 1;  }
  }
  for(j=1; j<coef_pre.length; j++){
    coef_pre[j] = coef_pre[j] * x[j]; }
    console.table(coef_pre);
  var sum = 0;
  for(k=0; k<coef_pre.length; k++){
    sum += coef_pre[k]; }
  var result = expit(sum);

  //find ci
  var initial=["","(Intercept)","agegrp2","agegrp3","agegrp4","brstproc1","brstproc9","nrelbc1","nrelbc2","nrelbc9","density2","density3","density4","density9",
"(Intercept)",0.0664320407720038,-0.0136477809143394,-0.0138226584176114,-0.0140337639655768,-0.000368668948297425,-0.000669985624335268,-0.00134556054544901,-0.00115023052970805,-0.000996895369675293,-0.0526980169293713,-0.0527055607302102,-0.0528459396706879,-0.0528076582849449,
"agegrp2",-0.0136477809143394,0.0153609318379136,0.0134813974213118,0.0134852020646986,7.35839158267006e-05,-5.48092501402831e-05,0.000696526829566442,0.000594810227314313,2.28157777018567e-05,1.57177605201402e-05,5.2746690572284e-06,7.4098726099541e-05,-2.57677108882098e-05,
"agegrp3",-0.0138226584176114,0.0134813974213118,0.0150035745922805,0.0135672940477572,-8.88829792689026e-05,0.000544084284501666,0.000705624437962924,0.000486575821328683,0.000493507049237037,3.47887451661009e-05,5.47778015924148e-05,0.00019568775853053,0.000203018249761248,
"agegrp4",-0.0140337639655768,0.0134852020646986,0.0135672940477572,0.0159963764640307,-0.000225753455981637,0.000532686823271202,0.000728289797921222,0.000501203600049731,0.000413646103351074,0.000133470659030696,0.000265982101707256,0.000572719455982893,0.000479977596847101,
"brstproc1",-0.000368668948297425,7.35839158267006e-05,-8.88829792689026e-05,-0.000225753455981637,0.003507542277175,0.000739075758926512,-0.000182217891718771,-0.000305887318920678,-6.27765252749106e-05,-0.000149339552045004,-0.000342820766317262,-0.000575948326118015,-0.000276083005492901,
"brstproc9",-0.000669985624335268,-5.48092501402831e-05,0.000544084284501666,0.000532686823271202,0.000739075758926512,0.0142996340469006,-0.000125486743605135,-3.82068205668379e-05,-0.00198676697838275,-0.000127374361096728,-0.000124653230605475,-0.000192948879171283,-0.000726552686825026,
"nrelbc1",-0.00134556054544901,0.000696526829566442,0.000705624437962924,0.000728289797921222,-0.000182217891718771,-0.000125486743605135,0.00388938043170478,0.000856189008884572,0.000852371373605705,-5.38087537350653e-05,-0.000119773020539559,-0.000139069081483798,-0.00013120865176463,
"nrelbc2",-0.00115023052970805,0.000594810227314313,0.000486575821328683,0.000501203600049731,-0.000305887318920678,-3.82068205668379e-05,0.000856189008884572,0.0568633403727103,0.000785357728791108,-8.34372346923235e-05,-0.00014491240596884,-0.000258637703112285,2.97934980385034e-05,
"nrelbc9",-0.000996895369675293,2.28157777018567e-05,0.000493507049237037,0.000413646103351074,-6.27765252749106e-05,-0.00198676697838275,0.000852371373605705,0.000785357728791108,0.00829444114303608,1.44247033717548e-05,-3.72189073630302e-05,4.13146878454954e-05,-0.000201963466954932,
"density2",-0.0526980169293713,1.57177605201402e-05,3.47887451661009e-05,0.000133470659030696,-0.000149339552045004,-0.000127374361096728,-5.38087537350653e-05,-8.34372346923235e-05,1.44247033717548e-05,0.0559561037141258,0.0526933590206496,0.0527108542928949,0.0527009769404816,
"density3",-0.0527055607302102,5.2746690572284e-06,5.47778015924148e-05,0.000265982101707256,-0.000342820766317262,-0.000124653230605475,-0.000119773020539559,-0.00014491240596884,-3.72189073630302e-05,0.0526933590206496,0.0541494819161978,0.0527613146490688,0.0527341115729378,
"density4",-0.0528459396706879,7.4098726099541e-05,0.00019568775853053,0.000572719455982893,-0.000575948326118015,-0.000192948879171283,-0.000139069081483798,-0.000258637703112285,4.13146878454954e-05,0.0527108542928949,0.0527613146490688,0.0568323912554103,0.0527803600641544,
"density9",-0.0528076582849449,-2.57677108882098e-05,0.000203018249761248,0.000479977596847101,-0.000276083005492901,-0.000726552686825026,-0.00013120865176463,2.97934980385034e-05,-0.000201963466954932,0.0527009769404816,0.0527341115729378,0.0527803600641544,0.0550574313194564,
];
  var sub = new Array();
  var v = new Array();
  for(i=14; i<= 14*14;i++){
    if(i%14 != 0){
      sub.push(initial[i]);
    }
    if(i != 14 && i%14 ==0){
      v.push(sub);
      sub = new Array();
      }
  }
  var realv = new Array();
  var temp = new Array();
  for(i = 0; i<=12; i++){
    for(j=0; j<=12; j++){
      temp.push(v[j][i])
    }
    realv.push(temp);
    temp = new Array();
  }
  var xT = new Array();
  for(i=1;i<x.length; i++){
    if(i!= 0 && i!=4 && i!=7 && i!=11){
      xT.push(x[i]);
    }
  }
  xT.unshift(1);

  var prod1 = new Array();
  var sum1 = 0;
  for(k=0; k<13; k++){
    for(l=0; l<13; l++){
      sum1 += realv[k][l]*xT[l];  }
    prod1.push(sum1);
    sum1=0;
  }
  var variance = 0;
  for(i=0;i<13;i++){
    variance+=prod1[i]*xT[i];
  }
  variance = 1.96*Math.pow(variance, 1/2);
  var ci_low = Math.round(100000*expit(sum-variance))/1000;
  var ci_high = Math.round(100000*expit(sum+variance))/1000;
  result = Math.round(100000*result)/1000;

  $('#grp').html("premenopausal");
  $('#grp_prob').html("0.304%");
  $('#value').html(result+"%");
  $('#ci').html(ci_low +"% - "+ci_high+"%")


  //graph
  // sets dimensions and margins
  var margin = {top: 50, right: 30, bottom: 50, left: 70},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#hist")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // get data
  d3.csv("https://raw.githubusercontent.com/czhang2718/generic-repo/master/pre_prob.txt", function(data) {
    // console.log("type of data array is " +typeof data);

    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.price })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Breast Cancer Risk*");

    //x axis label
    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," +
                         (height + margin.top-15) + ")")      //+20???
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Probability of Breast Cancer within 1 year (%)");

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.price; })
        .domain(x.domain())
        .thresholds(x.ticks(40)); //# bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (margin.left)+10) //-2
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of Women");

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0); })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#8FBC8F");

    //draw vertical line for datapoint
    svg.append("line")
        .attr("x1", 360*(result/d3.max(data, function(d) { return +d.price })))  //<<== change your code here
        .attr("y1", 0)
        .attr("x2", 360*(result/d3.max(data, function(d) { return +d.price })))  //<<== and here
        .attr("y2", height)
        .attr("class", "specification-line");
    //grp average
    svg.append("line")
        .attr("x1", 360*(0.444/d3.max(data, function(d) { return +d.price })))  //<<== change your code here
        .attr("y1", 0)
        .attr("x2", 360*(0.444/d3.max(data, function(d) { return +d.price })))  //<<== and here
        .attr("y2", height)
        .attr("class", "spec-line2");
  });

  $.get('https://raw.githubusercontent.com/czhang2718/generic-repo/master/pre_prob.txt', function(data){
    var dat = data.split("\n");
    // dat = dat.split(",");
    console.log("length is "+ dat.length);
    var ind = sortedIndex(dat, result);
    var p = ind/280205*100;
    $('#percentile').html(Math.round(1000*ind/280205*100)/1000+"%");
  });


}




//proceses result for postmeno women; finds risk, confidence interval, and creates graph
function process2(results_post){
  //find risk
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  var coef_post = [-7.07133333107288,0.283027461135041,0.674271362605484,0.819608769662894,0.903378551516557,1.02601377794812,1.10863382034239
,1.20228472508555,0, -0.30715798457356,-0.0640974604363655,0, -0.225099522380034,0.0935252572458875,-0.610810954136486,-0.0269466407170058
,-0.000374344084458271,0, 0.133678469713075,0.246264792099399,0.382678043710963,0.029486281784702,0, 0.187132064465036,0.163650597324745
,0.0203291275814157,0, 0.262009882833081,0.0584668111895277, 0, 0.272169309730185,0.507968794808823,-0.0488476975433144, 0, 0.171387166360782
,0.124416799276559, 0, -0.170080954411712,-0.0603202724478966, 0, 0.524115516051951,0.184030525643851,0, 0.737732989432157,1.07991333616496,1.14816508820206,1.04487623789699];
  var x= new Array(coef_post.length);
  for(n=0; n<coef_post.length; n++){
    x[n] = 0; }
  var numchoices = [8, 3, 6, 5, 4, 3, 4, 3, 3, 3, 5];
  var pos = 0;
  for(i=0; i<11; i++){
    if(i == 0){
      x[alphabet.indexOf(results_post[i])] = 1;  }
    else{
      pos += numchoices[i-1];
      x[alphabet.indexOf(results_post[i])+pos] = 1;  }
  }
  for(j=1; j<coef_post.length; j++){
    coef_post[j] = coef_post[j] * x[j]; }

  var sum = 0;
  for(k=0; k<coef_post.length; k++){
    sum += coef_post[k]; }
  var result = expit(sum);

//find ci
  $.get('https://raw.githubusercontent.com/czhang2718/generic-repo/master/var_post.txt', function(data){
    var var_post = data.replace(/"/g, "");
    var vpost = var_post.split(",");
    vpost = vpost.slice(38, var_post.length);
    var vcov = new Array();
    var temp = new Array();

    for(i = 1; i<vpost.length;i++){
      if(i%38==0){
        vcov.push(temp);
        temp = new Array();  }
      else{
        temp.push(vpost[i]);  }
    }
    vcov.push(temp);

    realv = new Array();
    temp = new Array();
    for(i=0; i<37; i++){
      for(j=0; j<37; j++){
        temp.push(vcov[j][i]);
      }
      realv.push(temp);
      temp = new Array();
    }

    var xT = new Array();
    for(i=0; i<results_post.length; i++){
      var length = alphabet.indexOf(results_post[i]);
      for(j=1; j<numchoices[i]; j++){
        if(j==length){
          xT.push(1);  }
        else{
          xT.push(0);  }
      }
    }
    xT.unshift(1);

    var prod1 = new Array();
    var sum1 = 0;
    for(i=0; i<xT.length; i++){
      for(j=0; j<xT.length; j++){
        sum1 += realv[i][j] * xT[j];
      }
      prod1.push(sum1);
      sum1=0;
    }
    var prod2 = 0;
    for(i=0; i<xT.length; i++){
      prod2 += prod1[i]*xT[i];
    }
    var variance = 1.96*Math.pow(prod2, .5);
    var ci_low = Math.round(10000*expit(sum - variance))/100;
    var ci_high = Math.round(10000*expit(sum + variance))/100;
    result = Math.round(10000*result)/100
    //set divs
    $('#grp').html("postmenopausal");
    $('#grp_prob').html("0.881%");
    $('#value').html(result+"%");
    $('#ci').html(ci_low +"% - "+ci_high+"%.");

  // graph
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 70, left: 70},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#hist")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("https://raw.githubusercontent.com/czhang2718/generic-repo/master/post_prob.txt", function(data) {

      // X axis: scale and draw:
      var x = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.price })])
          .range([0, width]);
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      //x axis label
      svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," +
                           (height + margin.top-15) + ")")      //+20???
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Probability of Breast Cancer within 1 year (%)");

      //title
      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .style("text-decoration", "underline")
          .text("Breast Cancer Risk*");


      // set the parameters for the histogram
      var histogram = d3.histogram()
          .value(function(d) { return d.price; })
          .domain(x.domain())
          .thresholds(x.ticks(40));

      //get bins
      var bins = histogram(data);

      // Y axis: scale and draw:
      var y = d3.scaleLinear()
          .range([height, 0]);
          y.domain([0, d3.max(bins, function(d) { return d.length; })])

      svg.append("g")         // Add the Y Axis
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
          // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left)+10)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Number of Women");

      // append the bar rectangles to the svg element
      svg.selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0); })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#8FBC8F");

      //patient risk vertical line
      svg.append("line")
          .attr("x1", 360*(result/d3.max(data, function(d) { return +d.price })))
          .attr("y1", 0)
          .attr("x2", 360*(result/d3.max(data, function(d) { return +d.price })))
          .attr("y2", height)
          .attr("class", "specification-line");

      //average grp Risk
      svg.append("line")
          .attr("x1", 360*(0.881/d3.max(data, function(d) { return +d.price })))
          .attr("y1", 0)
          .attr("x2", 360*(0.881/d3.max(data, function(d) { return +d.price })))
          .attr("y2", height)
          .attr("class", "spec-line2");
    });

    $.get('https://raw.githubusercontent.com/czhang2718/generic-repo/master/post_prob.txt', function(data){
      var dat = data.split("\n");
      console.log("length is "+ dat.length);
      var ind = sortedIndex(dat, result);
      var p = ind/638716*100;
      $('#percentile').html(Math.round(1000*ind/638716*100)/1000+"%");
    });
  })
  return;
  }
});
