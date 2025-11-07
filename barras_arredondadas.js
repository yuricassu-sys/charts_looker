{
  chart: {
    type: 'column',
    backgroundColor: 'transparent',
    borderRadius: 12,
    style: { fontFamily: 'Inter, sans-serif' }
  },

  colors: ['#2E86DE', '#10ac84', '#feca57', '#ff6b6b'],

  plotOptions: {
    column: {
      borderRadius: 8,                 // 🔵 Arredonda pontas
      borderWidth: 0,
      groupPadding: 0.15,
      pointPadding: 0.1,
      shadow: {
        color: 'rgba(0,0,0,0.08)',     // 🌫️ Sombra leve
        offsetX: 1,
        offsetY: 2,
        opacity: 0.1
      },
      states: { hover: { brightness: 0.08 } },
      animation: { duration: 900, easing: 'easeOutCubic' }
    },
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.y:.1f}',
        style: { color: '#333', fontWeight: '600', textOutline: 'none' }
      }
    }
  },

  tooltip: {
    shared: true,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    style: { color: '#fff', fontSize: '12px' }
  },

  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: { color: '#444', fontWeight: '500' }
  },

  xAxis: {
    lineColor: '#ddd',
    labels: { style: { color: '#666', fontWeight: '500' } }
  },

  yAxis: {
    gridLineColor: '#eee',
    title: { text: null },
    labels: { style: { color: '#666' } }
  }
}
