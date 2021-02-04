import fetch from '../utils/fetch';
import { Observable } from 'rxjs/Observable';//https://blog.csdn.net/qq_34414916/article/details/85194098

export function fetchList(query) {
    return fetch({
        url: '/draftbox/list',
        method: 'get',
        params: query
    });
}

export function delDraft(idArr) {
    const idStr = String(idArr);
    console.log('要删除的草稿id:' + idStr);
    return Observable.create(observer => {
        setTimeout(() => { observer.next(true); }, 1000);
    });
}
