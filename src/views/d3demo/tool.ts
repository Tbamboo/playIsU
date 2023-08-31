import * as d3 from 'd3';

export const tooltips = d3.select('body').append('div')
                  .attr("class", "bar-tooltip")
                  .style('width', '150px')
                  .style('height', 'auto')
                  .style('background-color', '#fff')
                  .style('border', '1px solid #999')
                  .style('border-radius', '5px')
                  .style('display', 'flex')
                  .style('align-tems', 'center')
                  .style('justify-content', 'left')
                  .style('opacity', 1)
                  .style('padding', '5px 10px')
                  