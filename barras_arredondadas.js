looker.plugins.visualizations.add({
  id: "bar_click_filter",
  label: "Bar Chart Click Filter",
  options: {},
  create: function(element, config) {
    // Cria o container do gráfico
    element.innerHTML = `<div id="chartContainer" style="width:100%; height:100%;"></div>`;
  },

  updateAsync: function(data, element, config, queryResponse, details, done) {
    // Garante que há dados
    if (!data || !data.length) {
      element.innerHTML = "<p>Nenhum dado disponível.</p>";
      done();
      return;
    }

    // Pega o primeiro campo de dimensão e medida
    const dim = queryResponse.fields.dimension_like[0].name;
    const measure = queryResponse.fields.measure_like[0].name;

    // Extrai os dados para o gráfico
    const categories = data.map(d => d[dim].value);
    const values = data.map(d => d[measure].value);

    // Renderiza com Highcharts (disponível no ambiente do Looker)
    Highcharts.chart("chartContainer", {
      chart: { type: "column", backgroundColor: "transparent" },
      title: { text: null },
      xAxis: { categories },
      yAxis: { title: { text: null } },
      plotOptions: {
        column: {
          borderRadius: 8,
          cursor: 'pointer',
          point: {
            events: {
              click: function() {
                // 🔥 Ação de filtro ao clicar
                LookerCharts.Utils.toggleCrossfilter(dim, this.category);
              }
            }
          }
        }
      },
      series: [{
        name: measure,
        data: values,
        colorByPoint: true
      }],
      credits: { enabled: false }
    });

    done();
  }
});
