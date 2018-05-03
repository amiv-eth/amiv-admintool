import m from 'mithril';
import infinite from 'mithril-infinite';


const pageSize = 5;
const getIndex = pageNum => (pageNum - 1) * pageSize;

function item(data, opts, itemIndex){
  return m('div', data.firstname);
}

function pageData(pageNum) {
  return new Promise((resolve, reject) => {
    m.request({
      method: 'GET',
      dataType: 'jsonp',
      headers: {
        'Authorization': 'root'
      },
      url: `https://amiv-api.ethz.ch/users?max_results=5&page=${pageNum}`,
    }).then((response) => {
      resolve(response._items);
    });
  });
}

export default {
  view: function() {
    return m('div', {
      style: {
        height: '400px'
      }
      //className: 'experiment_list',
      /*header: {
        title: 'Users'
      },*/
    }, m(infinite, {
        item,
        pageData,
      }),
    );
  }
}
