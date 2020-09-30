let currentDate = { // 現在の日付を保存
    year: 2020,
    month: 1,
    day: 1,
    week: 0 //月表示での何週目か
};
let selectedDate = { // 選択中の日付を保存
    date: '2020-01-01',
    week: 0
};

let displayMode = 'day' // 現状はday, week, month

// 手前に0を追加して桁数を調整
// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
    return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

function saveDateInGlobal() {
    const date = new Date();
    currentDate.year = date.getFullYear();
    currentDate.month = date.getMonth() + 1;
    currentDate.day = date.getDate();
}

function saveSelectedDateInGlobal(date, week) {
    if(date) { selectedDate.date = date }
    if(week) { selectedDate.week = week }
}

// day表示
function showScheduleInDay (rowdata, targetDate) {
    let data = rowdata.items;
    const schedule = document.getElementById('schedule');
    let scheduleElement = '';
    console.log(targetDate)

    for(let i = 0; i < data.length; i ++) {
        const id = data[i].id;
        const rowTitle = data[i].title.split('_');
        let title = '';
        let guest = '';
        if(rowTitle.length > 1) {
            title = rowTitle[1];
            guest = rowTitle[0];
        } else {
            title = data[i].title;
            guest = '';
        }
        let begin = '2020-01-01T00:00';
        if(data[i].begin && data[i].begin.datetime) {
            begin = data[i].begin.datetime;
        } else if(data[i].begin && data[i].begin.date) {
            begin = data[i].begin.date + 'T00:00';
        }
        let end = '2020-01-01T23:59';
        if(data[i].end && data[i].end.datetime) {
            end = data[i].end.datetime;
        } else if(data[i].end && data[i].end.date) {
            end = data[i].end.date + 'T23:59';
        }
        const summary = data[i].summary;

        // 取得したい日付(xxxx-xx-xx)に一致するか確認
        const regex = RegExp(targetDate);
        console.log(begin);
        if(!regex.test(begin)) { continue }

        let beginTime = begin.split('T');
        beginTime = beginTime[1].split(':');

        let endTime = end.split('T');
        endTime = endTime[1].split(':');

        // scheduleの長さを設定
        let height = ((parseInt(endTime[0]) * 60 + parseInt(endTime[1])) - (parseInt(beginTime[0]) * 60 + parseInt(beginTime[1]))) * 4 / 60;
console.log(height)
        // scheduleの開始位置を設定
        // 5分単位
        let top = Math.ceil(parseInt(beginTime[1]) / 5) * 4 / 12;

        // 時間単位
        if (parseInt(beginTime[0]) === 0) {
            top += 2;
        } else if(parseInt(beginTime[0]) > 0 && parseInt(beginTime[0]) < 24) {
            top += 2 + 4 * (parseInt(beginTime[0]));
        } else {
            top = -100;
        }

        scheduleElement += `<div id="${id}" class="schedule-child" style="top:${top + 0.125}%; height:${height}%; background-color: ${scheduleColor[i%10]};"><h2>${title}</h2><p><img src="./img/people_w.png">${guest}</p></div>`;
        console.log(scheduleElement)
    }

    schedule.innerHTML = scheduleElement;

}

function showScheduleInWeek (rowdata, targetDate, dom) {
    let data = rowdata.items;
    const schedule = document.getElementById('schedule');
    let scheduleElement = '';
    console.log(targetDate)

    for(let i = 0; i < data.length; i ++) {
        const id = data[i].id;
        const title = data[i].title;
        let begin = '2020-01-01T00:00';
        if(data[i].begin && data[i].begin.datetime) {
            begin = data[i].begin.datetime;
        } else if(data[i].begin && data[i].begin.date) {
            begin = data[i].begin.date;
        }
        let end = '2020-01-01T23:59';
        if(data[i].end && data[i].end.datetime) {
            end = data[i].end.datetime;
        } else if(data[i].end && data[i].end.date) {
            end = data[i].end.date;
        }
        const summary = data[i].summary;

        // 取得したい日付(xxxx-xx-xx)に一致するか確認
        const regex = RegExp(targetDate);
        console.log(begin);
        if(!regex.test(begin)) { continue }

        let beginTime = begin.split('T');
        beginTime = beginTime[1].split(':');

        let endTime = end.split('T');
        endTime = endTime[1].split(':');

        // scheduleの長さを設定
        let height = ((parseInt(endTime[0]) * 60 + parseInt(endTime[1])) - (parseInt(beginTime[0]) * 60 + parseInt(beginTime[1]))) * 9.2 / 60;

        // scheduleの開始位置を設定
        // 5分単位
        let top = Math.ceil(parseInt(beginTime[1]) / 5) * 9.2 / 12;

        // 時間単位
        if (parseInt(beginTime[0]) === 8) {
            top += 2;
        } else if(parseInt(beginTime[0]) > 0 && parseInt(beginTime[0]) < 24) {
            top += 2 + 4 * (parseInt(beginTime[0]));
        } else {
            top = -100;
        }

        scheduleElement += `<div id="${id}" class="schedule-child" style="top:${top + 0.125}%; height:${height-0.25}%; background-color: ${scheduleColor[i%10]};"><h2>${title}</h2><p><img src="./img/people_w.png">参加者名前</p></div>`;
        console.log(scheduleElement)
    }

    schedule.innerHTML = scheduleElement;

}

function checkText() {
    const newTitle = document.getElementById('new-title').value;
    const newStart = document.getElementById('new-start').value.split(' ').join('T');
    const newEnd = document.getElementById('new-end').value.split(' ').join('T');
    const newGuest = document.getElementById('new-guest').value;

    if(newTitle === '' || newStart === '' || newEnd === '' || newGuest === '') {
        alert('空欄をうめてください。')
        return
    } else {
        const body = {
            kind: "schedule",
            type: "jorte/events",
            begin: {
                "timezone": "Asia/Tokyo",
                "datetime": newStart + ':00'
            },
            end: {
                "timezone": "Asia/Tokyo",
                "datetime": newEnd + ':00'
            },
            title: `${newGuest}_${newTitle}`
        }
        // console.log(JSON.stringify(body));
        postEvent(JSON.stringify(body));
        const newSchedule = document.getElementById('new-schedule');
        newSchedule.style.display = 'none';
        newTitle.value = '';
        newStart.value = '';
        newEnd.value = '';
        newGuest.value = '';
    }
}

function openNewSchedule() {
    const newSchedule = document.getElementById('new-schedule');
    newSchedule.style.display = 'block';

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', checkText);

    const closeBtn = document.getElementById('new-schedule-close');
    closeBtn.addEventListener('click', function() {
        newSchedule.style.display = 'none';
    })
}