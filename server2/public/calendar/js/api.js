// const url = 'http://18.178.187.87:3000';
const url = 'http://web02.chronolink-demo.com:3000';

function callWagon(name) {
    const body = {
        MachineName: 'Wagon',
        Task: 'GoToMS-1',
        Guest: name
    }
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                console.log(xmlHttpRequest.responseText);
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('POST', url + '/api/wagon', true);
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/json' );

    xmlHttpRequest.send(JSON.stringify(body));
}

function getDayEvents(targetDate, dom) {
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
                if(displayMode === 'day') {
                    showScheduleInDay(data, targetDate);
                } else if(displayMode === 'week') {
                    showScheduleInWeek(data, targetDate, dom);
                } else if(displayMode === 'month') {
                    showScheduleInMonth(data, dom);
                } else {
                    location.reload();
                }

            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('GET', url + '/api/getSchedule', true);

    xmlHttpRequest.send();
}

// function getWeekEvents(targetDate, dom) {
//     // ひとまず日ごとに取得
//     const xmlHttpRequest = new XMLHttpRequest();

//     xmlHttpRequest.onreadystatechange = () => {

//         // ローカルファイル用 status === 0
//         if(xmlHttpRequest.readyState === 4){
//             if(xmlHttpRequest.status === 200) {
//                 const data = JSON.parse(xmlHttpRequest.responseText);
//                 console.log(xmlHttpRequest.responseText);
//                 showScheduleInWeek(data, targetDate, dom);
//             } else {
//                 console.error(xmlHttpRequest.statusText);
//             }
//         }
//     }

//     xmlHttpRequest.open('GET', url + '/api/getSchedule', true);

//     xmlHttpRequest.send();
// }

function postEvent(body) {
    console.log(body)
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                console.log(xmlHttpRequest.responseText);
                if(displayMode === 'day') {
                    getDayEvents(selectedDate.beginDate);
                } else if(displayMode === 'week') {
                    displayWeek();
                } else {
                    displayMonth();
                }
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('POST', url + '/api/postSchedule', true);
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/json' );

    xmlHttpRequest.send(body);

}

function updateEvent(id, body) {
    const xmlHttpRequest = new XMLHttpRequest();
    console.log(body)

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                console.log(xmlHttpRequest.responseText);
                if(displayMode === 'day') {
                    getDayEvents(selectedDate.beginDate);
                } else if(displayMode === 'week') {
                    displayWeek();
                } else {
                    displayMonth();
                }
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('POST', url + '/api/updateSchedule/' + id, true);
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/json' );

    xmlHttpRequest.send(body);

}

function getEvent(id) {
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                const data = JSON.parse(xmlHttpRequest.responseText);
                // console.log(xmlHttpRequest.responseText);

                let array = data.title.split('_');
                if(array.length > 1) {
                    console.log(selectedDate)
                    document.getElementById('detail-title').innerText = array[1];
                    document.getElementById('detail-guest').innerText = array[0];

                    selectedDate.title = array[1];
                    selectedDate.guest = array[0];
                } else {
                    document.getElementById('detail-title').innerText = data.title;
                    document.getElementById('detail-guest').innerText = '';

                    selectedDate.title = data.title;
                    selectedDate.guest = '';
                }

                if(data.begin.datetime) {
                    let begin = data.begin.datetime.split('T');
                    let date = begin[0].split('-');
                    let beginTime = begin[1].split(':');
                    let end = data.end.datetime.split('T');
                    let endTime = end[1].split(':');
                    document.getElementById('detail-time').innerHTML = '<img src="./img/time.png" alt="">' + date[1] + '月' + date[2] +'日  ' + beginTime[0] + ':' + beginTime[1] + ' - ' + endTime[0] + ':' + endTime[1];
                    selectedDate.beginDate = begin[0];
                    selectedDate.beginTime = beginTime[0] + ':' + beginTime[1];
                    selectedDate.endDate = end[0];
                    selectedDate.endTime = endTime[0] + ':' + endTime[1];
                    console.log(selectedDate)
                } else if(data.begin.date) {
                    let date = data.begin.date.split('-');
                    document.getElementById('detail-time').innerHTML = '<img src="./img/time.png" alt="">' + date[1] + '月' + date[2] + '日'
                    selectedDate.beginDate = data.begin.date;
                    selectedDate.beginTime = '00:00';
                    selectedDate.endDate = data.end.date;
                    selectedDate.endTime = '00:00';
                } else {
                    document.getElementById('detail-time').innerHTML = '<img src="./img/time.png" alt="">'
                }

                document.getElementById('detail-area').setAttribute('name', data.id);
                selectedDate.id = data.id;

                document.getElementById('edit-btn').addEventListener('click', openEditSchedule)
                document.getElementById('delete-btn').addEventListener('click', function() {
                    deleteEvent(selectedDate.id);
                    document.getElementById('detail-schedule').classList.add('display-none');
                })
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('GET', url + '/api/getSchedule?id=' + id, true);

    xmlHttpRequest.send();
}

function deleteEvent(id) {
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

        // ローカルファイル用 status === 0
        if(xmlHttpRequest.readyState === 4){
            if(xmlHttpRequest.status === 200) {
                console.log(xmlHttpRequest.responseText);
                if(displayMode === 'day') {
                    getDayEvents(selectedDate.beginDate);
                } else if(displayMode === 'week') {
                    displayWeek();
                } else {
                    displayMonth();
                }
            } else {
                console.error(xmlHttpRequest.statusText);
            }
        }
    }

    xmlHttpRequest.open('GET', url + '/api/deleteSchedule/' + id, true);

    xmlHttpRequest.send();

}