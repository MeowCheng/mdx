import betterFetch from './betterFetch.js';
import ele from './ele.js';

var urlV;
var page = 1;
window.addEventListener('DOMContentLoaded', () => {
    var textV = ele('div.nextpage a').innerText;
    if (textV === "") {
        ele('div.nextpage', (e) => { e.parentNode.removeChild(e) });
    } else {
        urlV = ele('div.nextpage a').getAttribute('href');
        ele('#postlist').insertAdjacentHTML('afterend', `<div class="mdui-hoverable nextpage2">${textV}</div>`);
        ele('div.nextpage', (e) => { e.parentNode.removeChild(e) });
        ele('div.main').addEventListener("click", (e) => {
            if (e.target.classList.contains('nextpage2') && e.target.tagName.toLowerCase() === 'div') {
                ele('div.nextpage2').style.display = 'none';
                ele('div.nextpage2').insertAdjacentHTML('afterend', `<div class="mdui-spinner mdx-ajax-loading mdui-center"></div>`);
                mdui.updateSpinners();
                ajax_load_index(urlV);
            }
        });
    }
    if (enhanced_ajax && document.getElementById("postlist").getElementsByTagName("a").length > 0) {
        if (!sessionStorage.getItem("mdx_index_page_1")) {
            sessionStorage.setItem("mdx_index_page_1", window.btoa(encodeURIComponent(document.getElementById("postlist").getElementsByTagName("a")[0].href)));
            sessionStorage.setItem("mdx_index_loaded_page", 1);
        } else if (sessionStorage.getItem("mdx_index_page_1") !== window.btoa(encodeURIComponent(document.getElementById("postlist").getElementsByTagName("a")[0].href))) {
            for (let i = 1; i <= parseInt(sessionStorage.getItem("mdx_index_loaded_page")); i++) {
                sessionStorage.removeItem("mdx_index_page_" + i);
            }
            sessionStorage.setItem("mdx_index_page_1", window.btoa(encodeURIComponent(document.getElementById("postlist").getElementsByTagName("a")[0].href)));
            sessionStorage.setItem("mdx_index_loaded_page", 1);
        } else if (parseInt(sessionStorage.getItem("mdx_index_loaded_page")) > 1) {
            for (let i = 2; i <= parseInt(sessionStorage.getItem("mdx_index_loaded_page")); i++) {
                var data = decodeURIComponent(window.atob(sessionStorage.getItem("mdx_index_page_" + i)));
                let dom = new DOMParser().parseFromString(data, "text/html");
                urlV = dom.querySelector('div.nextpage a');
                let data2 = '';
                if (urlV === null) {
                    data2 = data.replace('<div class="nextpage mdui-center"></div>', "");
                    ele('div.nextpage2', (e) => { e.parentNode.removeChild(e) });
                } else {
                    data2 = data;
                    let data2Parsed = new DOMParser().parseFromString(data2, "text/html");
                    let el = data2Parsed.querySelector('div.nextpage');
                    el.parentNode.removeChild(el);
                    ele('div.nextpage2').style.display = '';
                }
                let getValue = (typeof data2Parsed !== 'undefined' ? data2Parsed : new DOMParser().parseFromString(data2, "text/html")).getElementById('postlist').innerHTML;
                ele('#postlist').insertAdjacentHTML('beforeend', getValue);
                page = i;
            }
        }
    }
})

function ajax_load_index(url) {
    betterFetch(url, { credentials: 'same-origin' }).then((data) => {
        page++;
        let dom = new DOMParser().parseFromString(data, "text/html");
        urlV = dom.querySelector('div.nextpage a');
        if (enhanced_ajax && parseInt(sessionStorage.getItem("mdx_index_loaded_page")) <= 30) {
            sessionStorage.setItem("mdx_index_page_" + page, window.btoa(encodeURIComponent(data)));
            sessionStorage.setItem("mdx_index_loaded_page", page);
        }
        let data2 = '';
        if (urlV === null) {
            data2 = data.replace('<div class="nextpage mdui-center"></div>', "");
            ele('div.nextpage2', (e) => { e.parentNode.removeChild(e) });
        } else {
            data2 = data;
            let data2Parsed = new DOMParser().parseFromString(data2, "text/html");
            let el = data2Parsed.querySelector('div.nextpage');
            el.parentNode.removeChild(el);
            ele('div.nextpage2').style.display = '';
        }
        ele('div.mdx-ajax-loading', (e) => { e.parentNode.removeChild(e) });
        let getValue = (typeof data2Parsed !== 'undefined' ? data2Parsed : new DOMParser().parseFromString(data2, "text/html")).getElementById('postlist').innerHTML;
        ele('#postlist').insertAdjacentHTML('beforeend', getValue);
    }).catch(() => {
        mdui.snackbar({
            message: ajax_error,
            timeout: 5000,
            position: 'top',
        });
    })
}