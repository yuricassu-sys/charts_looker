looker.plugins.visualizations.add({
  id: "bar_click_filter",
  label: "Bar Chart Click Filter",
  options: {},
  create: function(element, config) {
    // cria um container único dentro do elemento (evita conflito de ids)
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    // gerar id único
    container.id = 'chartContainer_' + Math.random().toString(36).substr(2, 9);
    element.appendChild(container);
    // guardar referência
    this._container = container;
  },

  updateAsync: function(data, element, config, queryResponse, details, done) {
    try {
      // limpeza visual anterior
      if (!this._container) {
        done(new Error('Container não encontrado.'));
        return;
      }
      // valida dados mínimos
      const dimensionFields = queryResponse.fields.dimension_like || [];
      const measureFields = queryResponse.fields.measure_like || [];

      if (dimensionFields.length === 0 || measureFields.length === 0) {
        this._container.innerHTML = "<div style='padding:12px;color:#666'>A visualização precisa de pelo menos 1 dimensão e 1 medida.</div>";
        done();
        return;
      }

      // pegar nomes (referências)
      const dimField = dimensionFields[0].name;
      const measureField = measureFields[0].name;

      // extrair categorias/valores defensivamente
      const categories = data.map(d => {
        const v = d[dimField];
        return (v && (v.value !== undefined ? v.value : v.label)) || null;
      });
      const values = data.map(d => {
        const v = d[measureField];
        return (v && (v.value !== undefined ? v.value : v)) || 0;
      });

      // se Highcharts não existir, mostrar erro
      if (typeof Highcharts === 'undefined') {
        this._container.innerHTML = "<div style='padding:12px;color:#b00'>Highcharts não disponível neste ambiente.</div>";
        done(new Error('Highcharts not defined'));
        return;
      }

      // renderizar gráfico
      Highcharts.chart(this._container.id, {
        chart: { type: "column", backgroundColor: "transparent" },
        title: { text: null },
        xAxis: { categories: categories },
        yAxis: { title: { text: null } },
        plotOptions: {
          column: {
            borderRadius: 8,
            point: {
              events: {
                click: function() {
                  // tenta usar LookerCharts.Utils.toggleCrossfilter se existir
                  try {
                    if (typeof LookerCharts !== 'undefined' && LookerCharts.Utils && LookerCharts.Utils.toggleCrossfilter) {
                      LookerCharts.Utils.toggleCrossfilter(dimField, this.category);
                    } else if (typeof looker !== 'undefined' && looker.plugins && looker.plugins.visualizations) {
                      // fallback: disparar evento custom (não filtra automaticamente)
                      // console.log('clicked', dimField, this.category);
                    }
                  } catch (e) {
                    console.warn('Erro ao tentar aplicar filtro:', e);
                  }
                }
              }
            }
          }
        },
        series: [{
          name: measureField,
          data: values,
          colorByPoint: true
        }],
        credits: { enabled: false }
      });

      done();
    } catch (err) {
      // mostra o erro na tela e em console
      console.error(err);
      element.innerHTML = "<div style='padding:12px;color:#b00'>Erro ao renderizar visualização: " + (err.message || err) + "</div>";
      done(err);
    }
  }
});
