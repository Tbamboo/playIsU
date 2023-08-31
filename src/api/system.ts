import request from '../utils/service';

export const getAppMenu = (data: any, typeName: string) => {
  return request({
    url: `/data-packet/data/lists/${typeName}`,
    method: 'POST',
    data
  })
}