const $ = require('./jquery');
const Rules = require('./rules');

const Renderer = {};

const renderTime = (farm) => {
  const day = Rules.day(farm);
  const season = Rules.season(farm);

  return `Day ${day} of <span class="capitalize">${season}</span>`;
};

const renderFarmClasses = (farm, row, col) =>
  farm.land[row][col].map((land) => {
    const result = land.crop ? ['tile', land.crop] : [land.type];

    if (land.stage) {
      result.push(`stage${land.stage}`);
    }

    return result.join(' ');
  }).join(' ');

const renderFarm = (farm) => {
  let html = '';

  for (let row = 0; row < farm.rows; row += 1) {
    html += '<div class="row">';

    for (let col = 0; col < farm.cols; col += 1) {
      const klasses = renderFarmClasses(farm, row, col);

      html += `<div class="${klasses}" id="p${row}${col}"></div>`;
    }

    html += '</div>';
  }

  return html;
};

const renderMarket = (farm) => {
  let html = '<div>Market</div>';

  Rules.market(farm).forEach((crop) => {
    const amount = farm.market[crop.type] || 0;

    html += '<div class="item row">';
    html += `<span class="tile picture ${crop.type}"></span><span class="capitalize">${crop.type}</span>`;
    html += `<span class="amount">${amount}</span> &times; <span class="price">${crop.prices.crop}</span>`;
    html += '</div>';
  });

  return html;
};

const renderTool = (tool) => {
  $(`#${tool}`).addClass('active');

  if (tool === 'buy') {
    $('#farm').addClass('hidden');
    $('#store').removeClass('hidden');
    $('#market').addClass('hidden');
    return;
  }

  if (tool === 'sell') {
    $('#farm').addClass('hidden');
    $('#store').addClass('hidden');
    $('#market').removeClass('hidden');
    return;
  }

  $('#farm').removeClass('hidden');
  $('#store').addClass('hidden');
  $('#market').addClass('hidden');
};

const renderIfChanged = (selector, newHtml) => {
  const element = $(selector);
  const oldHtml = element.html();

  if (newHtml !== oldHtml) {
    element.html(newHtml);
  }
};

Renderer.clear = () => {
  $('#hoe').removeClass('active');
  $('#water').removeClass('active');
  $('#plant').removeClass('active');
  $('#buy').removeClass('active');
  $('#sell').removeClass('active');
};

Renderer.render = (farm, tool) => {
  Renderer.clear();
  renderTool(tool);
  renderIfChanged('#time', renderTime(farm));
  renderIfChanged('#farm', renderFarm(farm, tool));
  renderIfChanged('#market', renderMarket(farm));
};

Renderer.invalidate = (farm, tool) => {
  requestAnimationFrame(() => Renderer.render(farm, tool));
};

module.exports = Renderer;
