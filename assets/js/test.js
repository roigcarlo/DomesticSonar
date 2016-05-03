var party_colors =
{
  1: "#3498db",
  2: "#db3434",
  3: "#db7a34",
  4: "#77189e",
}

function simpleAjaxRequest(url,containerId) {
  $.ajax(url, {
    success: function(response) {
      $('#'+containerId).html(response)
    }
  })
}

function showOverviewComponent(containerId) {
  $('[overviewComponent]').each(function(id){
    $(this).hide();
  })
  $('#'+containerId).show()
}

function load_sample_proposal() {
  $.ajax("http://62.57.140.70:1337/proposal", {
    success: function(response) {

      views = response['view']
      props = response['data']

      $('#sample_proposal_container').html(views)

      var proposals = $('[proposalid]');
      proposals.forEach(function (prop){

        var fake_comp = Math.random() * 100;

        var chartData = [
          {
            value: fake_comp,
            color: party_colors[prop.party]
          },
          {
            value : 100-fake_comp,
            color : "#ecf0f1"
          }
        ];

        var charOptions = {
          segmentShowStroke : false,
          animation : false,
          showTooltips: true,
          tooltipEvents: ["mousemove", "touchstart", "touchmove"],
          tooltipFillColor: "rgba(0,0,0,0.8)",
          tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
          percentageInnerCutout: 66,
          scaleShowLabels: true,
          legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        }

        var ctx = $('#canvas_proposal_'+prop.id)[0].getContext("2d");
        var myDoughnut = new Chart(ctx).Doughnut(chartData, charOptions);
      })
    }
  })
}
