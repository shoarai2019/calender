let currentDate = { // 現在の日付を保存
    year: 2020,
    month: 1,
    day: 1,
    week: 0 //月表示での何週目か
};
let selectedDate = { // 選択中の日付を保存
    id: '',
    beginDate: '2020-01-01',
    beginTime: '00:00',
    endDate: '2020-01-01',
    endTime: '00:00',
    title: '',
    guest: '',
    week: 0
};

let displayMode = 'day' // day, week, month

// 当日の予定をすべて保存
let timeSchedule = [
    // {
    // id: '',
    // begin: '',
    // end: '',
    // title: '',
    // guest: ''
    // }
];

// 現在会議中の予定
let currentSchedule = {};

let waterHeight = 250;

let isScroll = true;

let beginPicker;

let endPicker;

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
    if(date) { selectedDate.beginDate = date }
    if(week) { selectedDate.week = week }
}

// day表示
function showScheduleInDay (rowdata, targetDate) {
    timeSchedule = []; // リセットする

    let data = rowdata.items;
    const schedule = document.getElementById('schedule');
    let scheduleElement = '<div id="current-line-day" class="current-line-day"></div>';

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

        // 本日の予定を保存
        let date = new Date();
        const regex0 = RegExp(date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2));
        if(regex0.test(begin)) {
            console.log(begin);
            let beginTime = begin.split('T');
            beginTime = beginTime[1].split(':');

            let endTime = end.split('T');
            endTime = endTime[1].split(':');

            let obj = {
                id: id,
                begin: beginTime,
                end: endTime,
                title: title,
                guest: guest,
                bg: scheduleColor[i%10]
            }

            timeSchedule.push(obj);
        }

        // 取得したい日付(xxxx-xx-xx)に一致するか確認
        const regex = RegExp(targetDate);
        if(!regex.test(begin)) { continue }

        let beginTime = begin.split('T');
        beginTime = beginTime[1].split(':');

        let endTime = end.split('T');
        endTime = endTime[1].split(':');

        // scheduleの長さを設定
        let height = ((parseInt(endTime[0]) * 60 + parseInt(endTime[1])) - (parseInt(beginTime[0]) * 60 + parseInt(beginTime[1]))) * 4 / 60;

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

        scheduleElement += `<div id="${id}" class="schedule-child schedule-part" style="top:${top + 0.125}%; height:${height}%; background-color: ${scheduleColor[i%10]};"><h2>${title}</h2><p><img src="./img/people_w.png">${guest}</p></div>`;
    }

    schedule.innerHTML = scheduleElement;
    const schedulePart = document.getElementsByClassName('schedule-part');
    for(let i = 0; i < schedulePart.length; i ++) {
        schedulePart[i].addEventListener('click', openDetailSchedule);
        schedulePart[i].addEventListener('touched', openDetailSchedule);
    }

}

function showScheduleInWeek (rowdata, targetDate, dom) {
    let data = rowdata.items;
    const schedule = document.getElementById('schedule');

    let scheduleElement = '';
    if(targetDate === currentDate.year + '-' + zeroPadding(currentDate.month, 2) + '-' + zeroPadding(currentDate.day, 2)) {
        scheduleElement = '<div id="current-line-week" class="current-line-week"></div>'
    } else {
        scheduleElement = '';
    }


    for(let i = 0; i < data.length; i ++) {
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

        const id = data[i].id;
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

        // 取得したい日付(xxxx-xx-xx)に一致するか確認
        const regex = RegExp(targetDate);
        if(!regex.test(begin)) { continue }

        let beginTime = begin.split('T');
        beginTime = beginTime[1].split(':');

        let endTime = end.split('T');
        endTime = endTime[1].split(':');

        // scheduleの長さを設定
        let height = ((parseInt(endTime[0]) * 60 + parseInt(endTime[1])) - (parseInt(beginTime[0]) * 60 + parseInt(beginTime[1]))) * 4 / 60;

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

        scheduleElement += `<div id="${id}" class="schedule-week schedule-child" style="top:${top + 0.125}%; height:${height-0.25}%; background-color: ${scheduleColor[i%10]};"><h2>${title}</h2><p><img src="./img/people_w.png">${guest}</p></div>`;
    }

    dom.innerHTML = scheduleElement;
    const scheduleWeek = document.getElementsByClassName('schedule-week');
    for(let i = 0; i < scheduleWeek.length; i ++) {
        scheduleWeek[i].addEventListener('click', openDetailSchedule);
        scheduleWeek[i].addEventListener('touched', openDetailSchedule);
    }

}

function showScheduleInMonth (rowdata, dayInMonthDom) {
    let data = rowdata.items;
    let scheduleElement = '';
    let count = 0;

    for(let i = 0; i < dayInMonthDom.length; i ++) {
        let targetDate = dayInMonthDom[i].getAttribute('data-date');

        scheduleElement = dayInMonthDom[i].textContent;
        count = 0;

        for(let k = 0; k < data.length; k ++) {
            const id = data[k].id;
            const title = data[k].title;
            let begin = '2020-01-01T00:00';
            if(data[k].begin && data[k].begin.datetime) {
                begin = data[k].begin.datetime;
            } else if(data[k].begin && data[k].begin.date) {
                begin = data[k].begin.date + 'T00:00';
            }
            let end = '2020-01-01T23:59';
            if(data[k].end && data[k].end.datetime) {
                end = data[k].end.datetime;
            } else if(data[k].end && data[k].end.date) {
                end = data[k].end.date + 'T23:59';
            }

            // 取得したい日付(xxxx-xx-xx)に一致するか確認
            const regex = RegExp(targetDate);
            if(!regex.test(begin)) { continue }

            if(count > 1) {
                count ++
                continue
            }

            begin = begin.split('T')
            let beginTime = begin[1].split(':')
            end = end.split('T')
            let endTime = end[1].split(':')
            // console.log(dayInMonthDom[i].textContent)

            scheduleElement += `<p id="${id}" style="background-color: ${scheduleColor[count%10]};">${beginTime[0]}:${beginTime[1]}-${endTime[0]}:${endTime[1]}</p>`;
            count ++;
        }
        if(count > 2) {
            scheduleElement += '<p class=ex>その他' + (count - 2) + '件</p>'
        }
        dayInMonthDom[i].innerHTML = scheduleElement;

        dayInMonthDom[i].addEventListener('click', function() {
            selectedDate.id = dayInMonthDom[i].getAttribute('id');
            selectedDate.beginDate = dayInMonthDom[i].getAttribute('data-date');
        })
    }

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
        console.log(body)
        postEvent(JSON.stringify(body));
        const newSchedule = document.getElementById('new-schedule');
        newSchedule.classList.add('display-none');
        newTitle.value = '';
        newStart.value = '';
        newEnd.value = '';
        newGuest.value = '';
    }
}

function finishEvent() {
    const date = new Date();
    const begin = date.getFullYear() + '-' + zeroPadding((date.getMonth() + 1), 2) + '-' + zeroPadding(date.getDate(), 2) + 'T' + currentSchedule.begin.join(':');
    const end = date.getFullYear() + '-' + zeroPadding((date.getMonth() + 1), 2) + '-' + zeroPadding(date.getDate(), 2) + 'T' + zeroPadding(date.getHours(), 2) + ':' + zeroPadding(Math.floor(date.getMinutes()/5)*5, 2) + ':00'

    const obj = {
        kind: "schedule",
        type: "jorte/events",
        begin: {
            timezone: "Asia/Tokyo",
            datetime: begin,
        },
        end: {
            timezone: "Asia/Tokyo",
            datetime: end,
        },
        title: currentSchedule.guest + '_' + currentSchedule.title,
    }

    updateEvent(currentSchedule.id, JSON.stringify(obj));
}

function updateRightDisplay(date) {
    // 日時更新
    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');

    currentDateElement.innerText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weeks[date.getDay()]}）`
    currentTimeElement.innerText = `${zeroPadding(date.getHours(), 2)}:${zeroPadding(date.getMinutes(), 2)}`

    let isSchedule = false;

    // 終了ボタンの設定
    const finishBtn = document.getElementById('finish-btn');
    finishBtn.addEventListener('click', finishEvent);
    finishBtn.addEventListener('touched', finishEvent);

    // animation更新
    for(let i = 0; i < timeSchedule.length; i ++) {
        let currentTime = date.getHours() * 60 + date.getMinutes();
        let begin = parseInt(timeSchedule[i].begin[0]) * 60 + parseInt(timeSchedule[i].begin[1]);
        let end = parseInt(timeSchedule[i].end[0]) * 60 + parseInt(timeSchedule[i].end[1]);

        if(begin <= currentTime && end > currentTime) {
            isSchedule = true;
            const currentScheduleArea = document.getElementById('current-schedule-area');
            const noShedule = document.getElementById('no-schedule');
            const timeKeeperAreaBtn = document.getElementById('timeKeeper-area-btn');

            currentScheduleArea.classList.remove('display-none');
            noShedule.classList.add('display-none');
            timeKeeperAreaBtn.classList.remove('display-none');

            currentSchedule = timeSchedule[i]

            const titleElement = document.getElementById('schedule-title');
            const timeElement = document.getElementById('schedule-time');
            const guestElement = document.getElementById('schedule-guest');
            titleElement.innerText = currentSchedule.title;
            timeElement.innerHTML = zeroPadding(timeSchedule[i].begin[0], 2) + ':' + zeroPadding(timeSchedule[i].begin[1], 2) + ' - ' + zeroPadding(timeSchedule[i].end[0], 2) + ':' + zeroPadding(timeSchedule[i].end[1], 2);
            guestElement.innerHTML = currentSchedule.guest;

            const mainRightHeight = document.getElementById('main-right').clientHeight;
            let height = (mainRightHeight * 4) - (250 + (mainRightHeight * 2 - 250) * (currentTime - begin) / (end - begin))
            waterHeight = height;
            jQuery(".main-right").raindrops({
                color: timeSchedule[i].bg,
                canvasHeight: mainRightHeight * 2,
                waveLength: 100,
                rippleSpeed: 0.05,
                density: 0.04
            });

        }
    }
    if(!isSchedule) {
        const currentScheduleArea = document.getElementById('current-schedule-area');
        const noShedule = document.getElementById('no-schedule');
        const timeKeeperAreaBtn = document.getElementById('timeKeeper-area-btn');
        currentScheduleArea.classList.add('display-none');
        noShedule.classList.remove('display-none');
        timeKeeperAreaBtn.classList.add('display-none');

        const canvas = document.querySelector('canvas');
        if(canvas) {
            canvas.parentNode.removeChild(canvas);
        }

    }

}

function openNewSchedule(e, date) {
    let calendarHeight;
    if(displayMode == 'day') {
        calendarHeight = document.getElementById('calendar-day').clientHeight;
    } else if(displayMode == 'week') {
        calendarHeight = document.getElementById('calendar-week').clientHeight;
    }
    const calendarArea = document.getElementById('calendar-area');

    // console.log(e.clientY + ':' + calendarDayHeight + ':' +     calendarArea.scrollTop)
    let pos = (e.clientY + calendarArea.scrollTop) / calendarHeight * 100
    console.log(pos)
    let clickedTime = '';
    if(pos <= 9.45) {
        clickedTime = ['00:00', '01:00']
    } else if(pos > 9.45 && pos <= 11.45) {
        clickedTime = ['00:30', '01:30']
    } else if(pos > 11.45 && pos <= 13.45) {
        clickedTime = ['01:00', '02:00']
    } else if(pos > 13.45 && pos <= 15.45) {
        clickedTime = ['01:30', '02:30']
    } else if(pos > 15.45 && pos <= 17.45) {
        clickedTime = ['02:00', '03:00']
    } else if(pos > 17.45 && pos <= 19.45) {
        clickedTime = ['02:30', '03:30']
    } else if(pos > 19.45 && pos <= 21.45) {
        clickedTime = ['03:00', '04:00']
    } else if(pos > 21.45 && pos <= 23.45) {
        clickedTime = ['03:30', '04:30']
    } else if(pos > 23.45 && pos <= 25.45) {
        clickedTime = ['04:00', '05:00']
    } else if(pos > 25.45 && pos <= 27.45) {
        clickedTime = ['04:30', '05:30']
    } else if(pos > 27.45 && pos <= 29.45) {
        clickedTime = ['05:00', '06:00']
    } else if(pos > 29.45 && pos <= 31.45) {
        clickedTime = ['05:30', '06:30']
    } else if(pos > 31.45 && pos <= 33.45) {
        clickedTime = ['06:00', '07:00']
    } else if(pos > 33.45 && pos <= 35.45) {
        clickedTime = ['06:30', '07:30']
    } else if(pos > 35.45 && pos <= 37.45) {
        clickedTime = ['07:00', '08:00']
    } else if(pos > 37.45 && pos <= 39.45) {
        clickedTime = ['07:30', '08:30']
    } else if(pos > 39.45 && pos <= 41.45) {
        clickedTime = ['08:00', '09:00']
    } else if(pos > 41.45 && pos <= 43.45) {
        clickedTime = ['08:30', '09:30']
    } else if(pos > 43.45 && pos <= 45.45) {
        clickedTime = ['09:00', '10:00']
    } else if(pos > 45.45 && pos <= 47.45) {
        clickedTime = ['09:30', '10:30']
    } else if(pos > 47.45 && pos <= 49.45) {
        clickedTime = ['10:00', '11:00']
    } else if(pos > 49.45 && pos <= 51.45) {
        clickedTime = ['10:30', '11:30']
    } else if(pos > 51.45 && pos <= 53.45) {
        clickedTime = ['11:00', '12:00']
    } else if(pos > 53.45 && pos <= 55.45) {
        clickedTime = ['11:30', '12:30']
    } else if(pos > 55.45 && pos <= 57.45) {
        clickedTime = ['12:00', '13:00']
    } else if(pos > 57.45 && pos <= 59.45) {
        clickedTime = ['12:30', '13:30']
    } else if(pos > 59.45 && pos <= 61.45) {
        clickedTime = ['13:00', '14:00']
    } else if(pos > 61.45 && pos <= 63.45) {
        clickedTime = ['13:30', '14:30']
    } else if(pos > 63.45 && pos <= 65.45) {
        clickedTime = ['14:00', '15:00']
    } else if(pos > 65.45 && pos <= 67.45) {
        clickedTime = ['14:30', '15:30']
    } else if(pos > 67.45 && pos <= 69.45) {
        clickedTime = ['15:00', '16:00']
    } else if(pos > 69.45 && pos <= 71.45) {
        clickedTime = ['15:30', '16:30']
    } else if(pos > 71.45 && pos <= 73.45) {
        clickedTime = ['16:00', '17:00']
    } else if(pos > 73.45 && pos <= 75.45) {
        clickedTime = ['16:30', '17:30']
    } else if(pos > 75.45 && pos <= 77.45) {
        clickedTime = ['17:00', '18:00']
    } else if(pos > 77.45 && pos <= 79.45) {
        clickedTime = ['17:30', '18:30']
    } else if(pos > 79.45 && pos <= 81.45) {
        clickedTime = ['18:00', '19:00']
    } else if(pos > 81.45 && pos <= 83.45) {
        clickedTime = ['18:30', '19:30']
    } else if(pos > 83.45 && pos <= 85.45) {
        clickedTime = ['19:00', '20:00']
    } else if(pos > 85.45 && pos <= 87.45) {
        clickedTime = ['19:30', '20:30']
    } else if(pos > 87.45 && pos <= 89.45) {
        clickedTime = ['20:00', '21:00']
    } else if(pos > 89.45 && pos <= 91.45) {
        clickedTime = ['20:30', '21:30']
    } else if(pos > 91.45 && pos <= 93.45) {
        clickedTime = ['21:00', '22:00']
    } else if(pos > 93.45 && pos <= 95.45) {
        clickedTime = ['21:30', '22:30']
    } else if(pos > 95.45 && pos <= 97.45) {
        clickedTime = ['22:00', '23:00']
    } else if(pos > 97.45 && pos <= 99.45) {
        clickedTime = ['22:30', '23:30']
    } else if(pos > 99.45) {
        clickedTime = ['23:00', '24:00']
    } else {
        clickedTime = ['10:00', '11:00']
    }

    const newStart = document.getElementById('new-start');
    const newEnd = document.getElementById('new-end');

    // newStart.value = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(date.getHours(), 2) + ':' + zeroPadding(Math.ceil(date.getMinutes() / 5) * 5, 2)
    newStart.value = date ? date + ' ' + clickedTime[0] : selectedDate.beginDate + ' ' + clickedTime[0]
    // newEnd.value = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(date.getHours() + 1, 2) + ':' + zeroPadding(Math.ceil(date.getMinutes() / 5) * 5, 2)
    newEnd.value = date ? date + ' ' + clickedTime[1] : selectedDate.beginDate + ' ' + clickedTime[1]

    // let pickerElement = document.getElementsByClassName('picker');
    // for(let i = 0; i < pickerElement.length; i++) {
    //     pickerElement[i].remove()
    // }
    if(!beginPicker) {
        beginPicker = new Picker(document.querySelector('.js-full-picker'), {
            // date: date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(date.getHours(), 2) + ':' + zeroPadding(Math.ceil(date.getMinutes() / 5) * 5, 2),
            date: date ? date : selectedDate.beginDate + ' ' + clickedTime[0],
            controls: true,
            format: 'YYYY-MM-DD HH:mm',
            headers: true,
            increment: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1,
                minute: 5,
            },
            rows: 3,
            text: {
                title: '日付を選択してください。',
                cancel: 'キャンセル',
                confirm: '確定',
                year: '年',
                month: '月',
                day: '日',
                hour: '時',
                minute: '分'
            }
        });
    }

    beginPicker.update()

    if(!endPicker) {
        endPicker = new Picker(document.getElementById('new-end'), {
            // date: date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(date.getHours(), 2) + ':' + zeroPadding(Math.ceil(date.getMinutes() / 5) * 5, 2),
            date: date ? date : selectedDate.beginDate + ' ' + clickedTime[1],
            controls: true,
            format: 'YYYY-MM-DD HH:mm',
            headers: true,
            increment: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1,
                minute: 5,
            },
            rows: 3,
            text: {
                title: '日付を選択してください。',
                cancel: 'キャンセル',
                confirm: '確定',
                year: '年',
                month: '月',
                day: '日',
                hour: '時',
                minute: '分'
            }
        });
    }

    endPicker.update();

    // new Picker(document.querySelector('.js-mini-picker'), {
    //     container: '.js-mini-picker-container',
    //     format: 'YYYY年MM月DD日 HH:mm',
    //     increment: {
    //         year: 1,
    //         month: 1,
    //         day: 1,
    //         hour: 1,
    //         minute: 5
    //     },
    //     inline: true,
    //     rows: 1,
    //   });

    //   new Picker(document.querySelector('.js-mini-picker2'), {
    //     container: '.js-mini-picker-container2',
    //     format: 'YYYY年MM月DD日 HH:mm',
    //     increment: {
    //         year: 1,
    //         month: 1,
    //         day: 1,
    //         hour: 1,
    //         minute: 5
    //     },
    //     inline: true,
    //     rows: 1,
    //   });

    const newSchedule = document.getElementById('new-schedule');
    newSchedule.classList.remove('display-none');
    console.log(clickedTime);
    document.getElementById('detail-schedule').classList.add('display-none');
    document.getElementById('edit-schedule').classList.add('display-none');

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', checkText);
    saveBtn.addEventListener('touched', checkText);

    const closeBtn = document.getElementById('new-schedule-close');
    closeBtn.addEventListener('click', function() {
        newSchedule.classList.add('display-none');
    })
}

function openDetailSchedule(e) {
    const detailSchedule = document.getElementById('detail-schedule');
    detailSchedule.classList.remove('display-none');
    e.stopPropagation();
    selectedDate.id = e.target.id
    getEvent(e.target.id);
}

let editBeginPicker;
let editEndPicker;

function openEditSchedule() {
    const newSchedule = document.getElementById('new-schedule');
    newSchedule.classList.add('display-none');
    const detailSchedule = document.getElementById('detail-schedule');
    detailSchedule.classList.add('display-none');
    const editSchedule = document.getElementById('edit-schedule');
    editSchedule.classList.remove('display-none');

    document.getElementById('edit-title').value = selectedDate.title;
    document.getElementById('edit-begin').value = selectedDate.beginDate + ' ' + selectedDate.beginTime;
    document.getElementById('edit-end').value = selectedDate.endDate + ' ' + selectedDate.endTime;
    document.getElementById('edit-guest').value = selectedDate.guest;
    console.log(selectedDate.beginTime);

    if(!editBeginPicker) {
        editBeginPicker = new Picker(document.getElementById('edit-begin'), {
            date: selectedDate.beginDate + ' ' + selectedDate.beginTime,
            controls: true,
            format: 'YYYY-MM-DD HH:mm',
            headers: true,
            increment: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1,
                minute: 5,
            },
            rows: 3,
            text: {
                title: '日付を選択してください。',
                cancel: 'キャンセル',
                confirm: '確定',
                year: '年',
                month: '月',
                day: '日',
                hour: '時',
                minute: '分'
            }
        });
    }

    editBeginPicker.update();

    if(!editEndPicker) {
        editEndPicker = new Picker(document.getElementById('edit-end'), {
            date: selectedDate.endDate + ' ' + selectedDate.endTime,
            controls: true,
            format: 'YYYY-MM-DD HH:mm',
            headers: true,
            increment: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1,
                minute: 5,
            },
            rows: 3,
            text: {
                title: '日付を選択してください。',
                cancel: 'キャンセル',
                confirm: '確定',
                year: '年',
                month: '月',
                day: '日',
                hour: '時',
                minute: '分'
            }
        });
    }

    editEndPicker.update();

    document.getElementById('save-btn2').addEventListener('click', function() {
        let obj = {
            kind: "schedule",
            type: "jorte/events",
            begin: {
                timezone: "Asia/Tokyo",
                datetime: document.getElementById('edit-begin').value.split(' ').join('T') + ':00',
            },
            end: {
                timezone: "Asia/Tokyo",
                datetime: document.getElementById('edit-end').value.split(' ').join('T') + ':00',
            },
            title: document.getElementById('edit-guest').value + '_' + document.getElementById('edit-title').value,
        }
        updateEvent(selectedDate.id, JSON.stringify(obj));
        console.log(obj)

        document.getElementById('edit-schedule').classList.add('display-none');
    })

    document.getElementById('save-btn2').addEventListener('touched', function() {
        let obj = {
            kind: "schedule",
            type: "jorte/events",
            begin: {
                timezone: "Asia/Tokyo",
                datetime: document.getElementById('edit-begin').value.split(' ').join('T'),
            },
            end: {
                timezone: "Asia/Tokyo",
                datetime: document.getElementById('edit-end').value.split(' ').join('T'),
            },
            title: selectedDate.guest + '_' + selectedDate.title,
        }
        updateEvent(selectedDate.id, JSON.stringify(obj));

        document.getElementById('edit-schedule').classList.add('display-none');
    })

    document.getElementById('delete-btn2').addEventListener('click', function() {
        deleteEvent(selectedDate.id);
    })
    document.getElementById('delete-btn2').addEventListener('touched', function() {
        deleteEvent(selectedDate.id);
    })

    document.getElementById('edit-close-btn').addEventListener('click', function() {
        document.getElementById('edit-schedule').classList.add('display-none');
    })
    document.getElementById('edit-close-btn').addEventListener('touched', function() {
        document.getElementById('edit-schedule').classList.add('display-none');
    })
}

function displayDay() {
    const dayBtn = document.getElementById('day-btn');
    const weekBtn = document.getElementById('week-btn');
    const monthBtn = document.getElementById('month-btn');

    displayMode = 'day';
    dayBtn.classList.add('active');
    weekBtn.classList.remove('active');
    monthBtn.classList.remove('active');

    const calendarDay = document.getElementById('calendar-day');
    const calendarWeek = document.getElementById('calendar-week');
    const calendarMonth = document.getElementById('calendar-month');
    const calendarHead = document.getElementById('calendar-head');
    const calendarHeadMonth = document.getElementById('calendar-head-month');
    const rigthArrow = document.getElementById('right-arrow');
    const leftArrow = document.getElementById('left-arrow');
    const guideLeft = document.getElementById('guide-left');
    const guideRight = document.getElementById('guide-right');

    calendarDay.classList.remove('display-none');
    calendarWeek.classList.add('display-none');
    calendarMonth.classList.add('display-none');
    calendarHead.classList.remove('display-none');
    calendarHeadMonth.classList.add('display-none');
    guideLeft.classList.add('display-none');
    guideRight.classList.add('display-none');

    calendarHead.style.padding = '0 50px';
    rigthArrow.style.right = '1%';
    calendarHead.classList.add('flex-between');
    calendarHead.classList.remove('flex-center');
    calendarHead.classList.remove('week');

    // leftArrow.addEventListener('click', function() {
    //     movePage('left');
    // })

    // rigthArrow.addEventListener('click', function() {
    //     movePage('right');
    // })


    getDayEvents(selectedDate.beginDate);
}

function displayWeek() {
    const dayBtn = document.getElementById('day-btn');
    const weekBtn = document.getElementById('week-btn');
    const monthBtn = document.getElementById('month-btn');

    displayMode = 'week';
    dayBtn.classList.remove('active');
    weekBtn.classList.add('active');
    monthBtn.classList.remove('active');

    const calendarDay = document.getElementById('calendar-day');
    const calendarWeek = document.getElementById('calendar-week');
    const calendarMonth = document.getElementById('calendar-month');
    const calendarHead = document.getElementById('calendar-head');
    const calendarHeadMonth = document.getElementById('calendar-head-month');
    const rigthArrow = document.getElementById('right-arrow');
    const leftArrow = document.getElementById('left-arrow');
    const guideLeft = document.getElementById('guide-left');
    const guideRight = document.getElementById('guide-right');

    calendarDay.classList.add('display-none');
    calendarWeek.classList.remove('display-none');
    calendarMonth.classList.add('display-none');
    calendarHead.classList.remove('display-none');
    calendarHeadMonth.classList.add('display-none');
    guideLeft.classList.add('display-none');
    guideRight.classList.add('display-none');

    calendarHead.style.padding = '0 33% 0 10%';
    rigthArrow.style.right = '33%';
    calendarHead.classList.remove('flex-between');
    calendarHead.classList.add('flex-center');
    calendarHead.classList.add('week');

    let dateInWeek = document.getElementsByClassName('calendar_td');
    let dayInWeekDom = document.getElementsByClassName('schedule-every-week');
    for(let i = 0; i < dateInWeek.length; i ++) {
        let targetDate = dateInWeek[i].getAttribute('data-date');
        getDayEvents(targetDate, dayInWeekDom[i]);

        dayInWeekDom[i].addEventListener('click', function(e) {
            let date = dateInWeek[i].getAttribute('data-date');
            openNewSchedule(e, date);
        })
    }

    // leftArrow.addEventListener('click', function() {
    //     movePage('left');
    // })

    // rigthArrow.addEventListener('click', function() {
    //     movePage('right');
    // })

}

function displayMonth() {
    const dayBtn = document.getElementById('day-btn');
    const weekBtn = document.getElementById('week-btn');
    const monthBtn = document.getElementById('month-btn');

    displayMode = 'month';
    dayBtn.classList.remove('active');
    weekBtn.classList.remove('active');
    monthBtn.classList.add('active');

    const calendarDay = document.getElementById('calendar-day');
    const calendarWeek = document.getElementById('calendar-week');
    const calendarMonth = document.getElementById('calendar-month');
    const calendarHead = document.getElementById('calendar-head');
    const calendarHeadMonth = document.getElementById('calendar-head-month');
    const guideLeft = document.getElementById('guide-left');
    const guideRight = document.getElementById('guide-right');

    calendarDay.classList.add('display-none');
    calendarWeek.classList.add('display-none');
    calendarMonth.classList.remove('display-none');
    calendarHead.classList.add('display-none');
    calendarHeadMonth.classList.remove('display-none');
    guideLeft.classList.remove('display-none');
    guideRight.classList.remove('display-none');

    let beginDateArray = selectedDate.beginDate.split('-')

    showCalendar(parseInt(beginDateArray[0]), parseInt(beginDateArray[1]));

    let dayInMonth = document.getElementsByClassName('calendar_allday');
    let targetDate = dayInMonth[0].getAttribute('data-date'); // 仮の日付
    for(let i = 0; i < dayInMonth.length; i ++) {
        dayInMonth[i].addEventListener('click', function(e) {
            displayMode = 'day';
            selectedDate.beginDate = dayInMonth[i].getAttribute('data-date');
            let date = new Date(selectedDate.beginDate);
            const calendarHead = document.getElementById('calendar-head');
            let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
            calendarHead.innerHTML = headerDomArray[selectedDate.week];
            document.getElementById('left-arrow').addEventListener('click', function() {
                movePage('left');
            })
            document.getElementById('right-arrow').addEventListener('click', function() {
                movePage('right');
            })
            // getDayEvents(selectedDate.beginDate)
            displayDay();
        })
    }
    getDayEvents(targetDate, dayInMonth);

    // guideLeft.addEventListener('click', function() {
    //     console.log('click')
    //     movePage('left');
    // })

    // guideRight.addEventListener('click', function() {
    //     console.log('click')
    //     movePage('right');
    // })
}

// スワイプ取得
var touchStartX;
var touchStartY;
var touchMoveX;
var touchMoveY;

function movePage(direction) {
    // 移動量の判定
    if (touchStartX > touchMoveX || direction === 'right') {
        if (touchStartX > (touchMoveX + 50) || direction === 'right') {
            //右から左に指が移動した場合
            if(displayMode === 'day') {
                let date = new Date(selectedDate.beginDate);
                date.setDate(date.getDate() + 1);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                getDayEvents(selectedDate.beginDate)
                console.log(selectedDate)
            } else if(displayMode === 'week') {
                let date = new Date(selectedDate.beginDate);
                date.setDate(date.getDate() + 7);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                displayWeek();
                console.log(selectedDate)
            } else if(displayMode === 'month') {
                console.log('month!')
                let date = new Date(selectedDate.beginDate);
                date.setMonth(date.getMonth() + 1);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                displayMonth();
            }
            // header event
            const calendarTd = document.getElementsByClassName('calendar_td');
            for(let i = 0; i < calendarTd.length; i ++) {
                calendarTd[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    displayMode = 'day';
                    selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
                    for(let k = 0; k < calendarTd.length; k ++) {
                        calendarTd[k].classList.remove('selected');
                    }
                    calendarTd[i].classList.add('selected');
                    displayDay();
                })
                calendarTd[i].addEventListener('touched', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    displayMode = 'day';
                    selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
                    for(let k = 0; k < calendarTd.length; i ++) {
                        calendarTd[k].classList.remove('selected');
                    }
                    calendarTd[i].classList.add(selected);
                    displayDay();
                })
            }
        }
    } else if (touchStartX < touchMoveX || direction === 'left') {
        if ((touchStartX + 50) < touchMoveX || direction === 'left') {
            //左から右に指が移動した場合
            if(displayMode === 'day') {
                let date = new Date(selectedDate.beginDate);
                date.setDate(date.getDate() - 1);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);
                console.log(selectedDate)

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                getDayEvents(selectedDate.beginDate)
            } else if(displayMode === 'week') {
                let date = new Date(selectedDate.beginDate);
                date.setDate(date.getDate() - 7);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                displayWeek();
            } else if(displayMode === 'month') {
                let date = new Date(selectedDate.beginDate);
                date.setMonth(date.getMonth() - 1);
                selectedDate.beginDate = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2);

                const calendarHead = document.getElementById('calendar-head');
                let headerDomArray = updateHeader(date.getFullYear(), date.getMonth() + 1, date.getDate());
                calendarHead.innerHTML = headerDomArray[selectedDate.week];
                document.getElementById('left-arrow').addEventListener('click', function() {
                    movePage('left');
                })
                document.getElementById('right-arrow').addEventListener('click', function() {
                    movePage('right');
                })
                displayMonth();
            }
            // header event
            const calendarTd = document.getElementsByClassName('calendar_td');
            for(let i = 0; i < calendarTd.length; i ++) {
                calendarTd[i].addEventListener('click', function(e) {
                    e.stopPropagation();
                    displayMode = 'day';
                    selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
                    for(let k = 0; k < calendarTd.length; k ++) {
                        calendarTd[k].classList.remove('selected');
                    }
                    calendarTd[i].classList.add('selected');
                    getDayEvents(selectedDate.beginDate);
                })
                calendarTd[i].addEventListener('touched', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    displayMode = 'day';
                    selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
                    for(let k = 0; k < calendarTd.length; i ++) {
                        calendarTd[k].classList.remove('selected');
                    }
                    calendarTd[i].classList.add(selected);
                    getDayEvents(selectedDate.beginDate);
                })
            }
        }
    }

}