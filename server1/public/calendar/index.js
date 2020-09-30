const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
const config = {
    show: 1,
}



function createHeader(year, month, day) {
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数
    let arrayOfEveryWeek = []; // 日付を週単位で保存

    for (let w = 0; w < 6; w++) {
        calendarHtml = '<div id="left-arrow" class="left-arrow"><img src="./img/left-arrow.png" alt="<"></div><div id="right-arrow" class="right-arrow"><img src="./img/right-arrow.png" alt=">"></div>';

        for (let d = 0; d < 7; d++) {
            if(year === currentDate.year && month === currentDate.month && dayCount === currentDate.day) {
                currentDate.week = w;
            }
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                let prevDate = new Date(year, month -1, 0);
                calendarHtml += '<p class="calendar_td is-disabled" data-date="' + prevDate.getFullYear() + '-' + zeroPadding(prevDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                let nextDate = new Date(year, month, 1)
                calendarHtml += '<p class="calendar_td is-disabled" data-date="' + nextDate.getFullYear() + '-' + zeroPadding(nextDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                dayCount++;
            } else {
                let dayArray = selectedDate.beginDate.split('-')
                if(currentDate.day == dayCount) {
                    calendarHtml += `<p class="calendar_td today selected" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                } else if(dayArray[2] == dayCount) {
                    calendarHtml += `<p class="calendar_td selected" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                } else {
                    calendarHtml += `<p class="calendar_td" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                }

                dayCount++
            }
        }
        arrayOfEveryWeek.push(calendarHtml);
    }

    return arrayOfEveryWeek
}

function updateHeader(year, month, day) {
    document.getElementById('top-time').innerText = year + '年' + month + '月';

    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数
    let arrayOfEveryWeek = []; // 日付を週単位で保存

    for (let w = 0; w < 6; w++) {
        calendarHtml = '<div id="left-arrow" class="left-arrow"><img src="./img/left-arrow.png" alt="<"></div><div id="right-arrow" class="right-arrow"><img src="./img/right-arrow.png" alt=">"></div>';


        for (let d = 0; d < 7; d++) {

            if(year === currentDate.year && month === currentDate.month && dayCount === currentDate.day) {
                currentDate.week = w;
            } else if(dayCount === day) {
                console.log('w' + ':' + w + ',' + dayCount + ':' + day)
                selectedDate.week = w;
            }
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                let prevDate = new Date(year, month -1, 0);

                if(prevDate.getFullYear() == currentDate.year && (prevDate.getMonth() + 1) == currentDate.month && num == currentDate.day) {
                    calendarHtml += '<p class="today calendar_td is-disabled" data-date="' + prevDate.getFullYear() + '-' + zeroPadding(prevDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                } else {
                    calendarHtml += '<p class="calendar_td is-disabled" data-date="' + prevDate.getFullYear() + '-' + zeroPadding(prevDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                }

            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                let nextDate = new Date(year, month, 1)
                if(nextDate.getFullYear() == currentDate.year && (nextDate.getMonth() + 1) == currentDate.month && num == currentDate.day) {
                    calendarHtml += '<p class="today calendar_td is-disabled" data-date="' + nextDate.getFullYear() + '-' + zeroPadding(nextDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                } else {
                    calendarHtml += '<p class="calendar_td is-disabled" data-date="' + nextDate.getFullYear() + '-' + zeroPadding(nextDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                }
                dayCount++
            } else {
                // console.log(currentDate.day + ':' + dayCount)
                let dayArray = selectedDate.beginDate.split('-')
                if(year === currentDate.year && month === currentDate.month && dayCount === currentDate.day && dayCount == dayArray[2]) {
                    calendarHtml += `<p class="calendar_td today selected" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                } else if (year === currentDate.year && month === currentDate.month && dayCount === currentDate.day) {
                    calendarHtml += `<p class="calendar_td today" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                } else if(dayArray[2] == dayCount) {
                    calendarHtml += `<p class="calendar_td selected" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                } else {
                    calendarHtml += `<p class="calendar_td" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                }

                dayCount++
            }
        }
        arrayOfEveryWeek.push(calendarHtml);
    }

    return arrayOfEveryWeek
}

function showCalendar(year, month) {
    // for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('div')
        sec.style.height = '100%';
        sec.innerHTML = calendarHtml
        document.querySelector('#calendar-month').textContent = null
        document.querySelector('#calendar-month').appendChild(sec)

        month++
        if (month > 12) {
            year++
            month = 1
        }
    // }
}

function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    calendarHtml += '<table frame="void" style="width: 100%; height:100%;">'

    // 曜日の行を作成
    // for (let i = 0; i < weeks.length; i++) {
    //     calendarHtml += '<td>' + weeks[i] + '</td>'
    // }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                let prevDate = new Date(year, month -1, 0);
                if(d === 0 || d === 6) {
                    calendarHtml += '<td class="calendar_allday is-disabled week-end" data-date="' + prevDate.getFullYear() + '-' + zeroPadding(prevDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '</td>'
                } else {
                    calendarHtml += '<td class="calendar_allday is-disabled" data-date="' + prevDate.getFullYear() + '-' + zeroPadding(prevDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '</td>'
                }

            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount;
                let nextDate = new Date(year, month, 1);
                if(d === 0 || d === 6) {
                    calendarHtml += '<td class="calendar_allday is-disabled week-end" data-date="' + nextDate.getFullYear() + '-' + zeroPadding(nextDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '</td>'
                } else {
                    calendarHtml += '<td class="calendar_allday is-disabled" data-date="' + nextDate.getFullYear() + '-' + zeroPadding(nextDate.getMonth() + 1, 2) + '-' + zeroPadding(num, 2) + '">' + num + '</td>'
                }
                dayCount++
            } else {
                if(d === 0 || d === 6) {
                    calendarHtml += `<td class="calendar_allday week-end" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}</td>`
                } else {
                    calendarHtml += `<td class="calendar_allday" data-date="${year}-${zeroPadding(month, 2)}-${zeroPadding(dayCount, 2)}">${dayCount}</td>`
                }

                dayCount++
            }
        }
        calendarHtml += '</tr>'
    }
    calendarHtml += '</table>'

    return calendarHtml
}

function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = ''

    if (e.target.id === 'prev') {
        month--

        if (month < 1) {
            year--
            month = 12
        }
    }

    if (e.target.id === 'next') {
        month++

        if (month > 12) {
            year++
            month = 1
        }
    }

    showCalendar(year, month)
}

window.onload = () => {

    // 現在時刻を保存
    saveDateInGlobal();

    setInterval(function(){
        saveDateInGlobal();
        let date  = new Date();

        // 今日のスケジュールから検索し、現時刻で該当するものがあれば表示
        updateRightDisplay(date);

        // current-lineの位置を設定
        // 5分単位
        let top = Math.ceil(parseInt(date.getMinutes()) / 5) * 4 / 12;

        // 時間単位
        if (parseInt(date.getHours()) === 0) {
            top += 2;
        } else if(parseInt(date.getHours()) > 0 && parseInt(date.getHours()) < 24) {
            top += 2 + 4 * (parseInt(date.getHours()));
        } else {
            top = -100;
        }

        const currentLineDay = document.getElementById('current-line-day');
        if(displayMode == 'week') {
            const currentLineWeek = document.getElementById('current-line-week');
            currentLineWeek.style.top = top + '%';
        }
        currentLineDay.style.top = top + '%';

        // 自動スクロール
        if(isScroll) {
            const calendarArea = document.getElementById('calendar-area');
            if(displayMode === 'day') {
                const calendarDayHeight = document.getElementById('calendar-day').clientHeight;
                calendarArea.scrollTop = calendarDayHeight * top / 100 - calendarArea.clientHeight / 2;
            } else if(displayMode === 'week') {
                const calendarWeekHeight = document.getElementById('calendar-week').clientHeight;
                calendarArea.scrollTop = calendarWeekHeight * top / 100 - calendarArea.clientHeight / 2;
            } else {
                calendarArea.scrollTop = 0;
            }
        }

    }, 2000)

    // 画角に合わせて高さ調整
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    let height = document.body.clientHeight - header.clientHeight;
    main.style.height = height + 'px';

    document.querySelector('#prev').addEventListener('click', moveCalendar)
    document.querySelector('#next').addEventListener('click', moveCalendar)

    // document.addEventListener("click", function(e) {
    //     if(e.target.classList.contains("calendar_td")) {
    //         alert('クリックした日付は' + e.target.dataset.date + 'です')
    //     }
    // })

    window.addEventListener('touchmove', function(e) {
        isScroll = false;

        setTimeout(() => {
            isScroll = true;
        }, 5000);
    })

    document.getElementById('calendar-area').addEventListener('scroll', function(e) {

        isScroll = false;

        setTimeout(() => {
            isScroll = true;
        }, 5000);
    })

    const dayBtn = document.getElementById('day-btn');
    const weekBtn = document.getElementById('week-btn');
    const monthBtn = document.getElementById('month-btn');

    dayBtn.addEventListener('touched', (e) => {
        displayDay();
    }, false)
    dayBtn.addEventListener('click', (e) => {
        displayDay()
    }, false)

    weekBtn.addEventListener('touched', (e) => {
        e.preventDefault();
        displayWeek();
    }, false)
    weekBtn.addEventListener('click', () => {
        displayWeek();
    }, false)

    monthBtn.addEventListener('touched', (e) => {
        e.preventDefault();
        displayMonth();
    })

    monthBtn.addEventListener('click', () => {
        displayMonth();
    })



    document.getElementById('today-btn').addEventListener('click', function() { location.reload(); })
    document.getElementById('today-btn').addEventListener('touched', function() { location.reload(); })

    showCalendar(year, month);

    const today = new Date();
    saveSelectedDateInGlobal(`${today.getFullYear()}-${zeroPadding(today.getMonth()+1, 2)}-${zeroPadding(today.getDate(), 2)}`, currentDate.week);
    getDayEvents(`${today.getFullYear()}-${zeroPadding(today.getMonth()+1, 2)}-${zeroPadding(today.getDate(), 2)}`);

    const calendarHead = document.getElementById('calendar-head');
    calendarHead.innerHTML = createHeader(currentDate.year, currentDate.month)[currentDate.week];
    const calendarTd = document.getElementsByClassName('calendar_td');
    for(let i = 0; i < calendarTd.length; i ++) {
        calendarTd[i].addEventListener('click', function(e) {
            displayMode = 'day';
            selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
            let dateArray =  selectedDate.beginDate.split('-')
            document.getElementById('top-time').innerText = dateArray[0] + '年' + parseInt(dateArray[1]) + '月'
            for(let k = 0; k < calendarTd.length; k ++) {
                calendarTd[k].classList.remove('selected');
            }
            calendarTd[i].classList.add('selected');
            displayDay();
        })
        calendarTd[i].addEventListener('touched', function(e) {
            displayMode = 'day';
            selectedDate.beginDate = calendarTd[i].getAttribute('data-date');
            for(let k = 0; k < calendarTd.length; i ++) {
                calendarTd[k].classList.remove('selected');
            }
            calendarTd[i].classList.add(selected);
            displayDay();
        })
    }

    document.getElementById('top-time').innerText = currentDate.year + '年' + currentDate.month + '月'

    const scheduleElement = document.getElementById('schedule');
    scheduleElement.addEventListener('click', function(e) {
        console.log('click')
        openNewSchedule(e);
    });

    const guideLeft = document.getElementById('guide-left');
    const guideRight = document.getElementById('guide-right');
    const rigthArrow = document.getElementById('right-arrow');
    const leftArrow = document.getElementById('left-arrow');

    guideLeft.addEventListener('click', function() {
        console.log('click')
        movePage('left');
    })

    guideRight.addEventListener('click', function() {
        console.log('click')
        movePage('right');
    })

    leftArrow.addEventListener('click', function() {
        movePage('left');
    })

    rigthArrow.addEventListener('click', function() {
        movePage('right');
    })

    scheduleElement.addEventListener('touched', function(e) {
        openNewSchedule(e);
    });

    // 開始時
    document.getElementById('calendar-head').addEventListener("touchstart", function(e) {
        // 座標の取得
        touchStartX = event.touches[0].pageX;
        touchStartY = event.touches[0].pageY;
    }, false);

    document.getElementById('calendar-head-month').addEventListener("touchstart", function(e) {
        // 座標の取得
        touchStartX = event.touches[0].pageX;
        touchStartY = event.touches[0].pageY;
    }, false);

    // 移動時
    document.getElementById('calendar-head').addEventListener("touchmove", function(e) {
        // 座標の取得
        touchMoveX = event.changedTouches[0].pageX;
        touchMoveY = event.changedTouches[0].pageY;
    }, false);

        document.getElementById('calendar-head-month').addEventListener("touchmove", function(e) {
        // 座標の取得
        touchMoveX = event.changedTouches[0].pageX;
        touchMoveY = event.changedTouches[0].pageY;
    }, false);

    // 終了時
    document.getElementById('calendar-head').addEventListener("touchend", function(e) {
        movePage();
    }, false);

    document.getElementById('calendar-head-month').addEventListener("touchend", function(e) {
        movePage();
    }, false);

        document.getElementById('use').addEventListener('click', function() {
            const newStart = document.getElementById('new-start');
            const newEnd = document.getElementById('new-end');

            let date = new Date();

            let beginHour = date.getHours();
            let beginMinute = Math.ceil(date.getMinutes()/5)*5;
            let endHour = date.getHours() + 1;
            if(Math.ceil(date.getMinutes()/5)*5 >= 60) {
                beginMinute = 0;
                beginHour = date.getHours() + 1;
                endHour = date.getHours() + 2;
            }
            // console.log(date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(hour, 2) + ':' + zeroPadding(minute, 2))
            newStart.value = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(beginHour, 2) + ':' + zeroPadding(beginMinute, 2);
            newEnd.value = date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate(), 2) + ' ' + zeroPadding(endHour, 2) + ':' + zeroPadding(beginMinute, 2);

            if(!beginPicker) {
                beginPicker = new Picker(document.querySelector('.js-full-picker'), {
                    date: date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate()) + ' ' + zeroPadding(date.getHours(), 2) + zeroPadding(Math.ceil(date.getMinutes()/5)*5, 2),
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
                    date: date.getFullYear() + '-' + zeroPadding(date.getMonth() + 1, 2) + '-' + zeroPadding(date.getDate()) + ' ' + zeroPadding(date.getHours() + 1, 2) + zeroPadding(Math.ceil(date.getMinutes()/5)*5, 2),
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

            const newSchedule = document.getElementById('new-schedule');
            newSchedule.classList.remove('display-none');
            document.getElementById('detail-schedule').classList.add('display-none');
            document.getElementById('edit-schedule').classList.add('display-none');

            const saveBtn = document.getElementById('save-btn');
            saveBtn.addEventListener('click', checkText);
            saveBtn.addEventListener('touched', checkText);

            const closeBtn = document.getElementById('new-schedule-close');
            closeBtn.addEventListener('click', function() {
                newSchedule.classList.add('display-none');
            })
        })

        const scheduleChild = document.getElementsByClassName('schedule-child');
        for(let i = 0; i < scheduleChild.length; i ++) {
            scheduleChild[i].addEventListener('click', openEditSchedule);
            scheduleChild[i].addEventListener('touched', openEditSchedule);
        }

        document.getElementById('call-wagon').addEventListener('click', function() {
            if(window.confirm('ワゴンを呼びますか？')) {
                callWagon(currentSchedule.guest);
            }
        })
}
