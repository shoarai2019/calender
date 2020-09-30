function getDayEvents(targetDate) {
    // const authObj = {
    //     grant_type: 'password',
    //     username: 'katsuta_demo_asset1',
    //     password: 'katsuta_demo',
    //     client_id: 'hitachi-chronolink'
    // }

    // const bodyData = new FormData();
    // for(key in authObj) {
    //     bodyData.append(key, authObj[key]);
    // }

    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                const data = JSON.parse(xmlHttpRequest.responseText);
                // console.log(xmlHttpRequest.responseText);
                showScheduleInDay(data, targetDate);
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('GET', 'http://localhost:3000/api/getSchedule', true);

    xmlHttpRequest.send();
}

function getWeekEvents(targetDate, dom) {
    // ひとまず日ごとに取得
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                const data = JSON.parse(xmlHttpRequest.responseText);
                console.log(xmlHttpRequest.responseText);
                showScheduleInWeek(data, targetDate, dom);
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('GET', 'http://localhost:3000/api/getSchedule', true);

    xmlHttpRequest.send();
}

function postEvent(body) {
    console.log(body)
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                console.log(xmlHttpRequest.responseText);
                if(displayMode === 'day') {
                    getDayEvents(selectedDate.date);
                }
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('POST', 'http://localhost:3000/api/postSchedule', true);
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/json' );

    xmlHttpRequest.send(body);

}