const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
const config = {
    show: 1,
}



function createHeader(year, month) {
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数
    let arrayOfEveryWeek = []; // 日付を週単位で保存

    for (let w = 0; w < 6; w++) {
        calendarHtml = '';

        for (let d = 0; d < 7; d++) {
            if(year === currentDate.year && month === currentDate.month && dayCount === currentDate.day) {
                currentDate.week = w;
            }
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1
                calendarHtml += '<p class="is-disabled">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                calendarHtml += '<p class="is-disabled">' + num + '<span>' + weeks[d] + '</span>' + '</p>'
                dayCount++
            } else {
                calendarHtml += `<p class="calendar_td" data-date="${year}${zeroPadding(month, 2)}${zeroPadding(dayCount, 2)}">${dayCount}<span>${weeks[d]}</span></p>`
                dayCount++
            }
        }
        arrayOfEveryWeek.push(calendarHtml);
    }

    return arrayOfEveryWeek
}

function showCalendar(year, month) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('div')
        sec.style.height = '100%';
        sec.innerHTML = calendarHtml
        document.querySelector('#calendar-month').appendChild(sec)

        month++
        if (month > 12) {
            year++
            month = 1
        }
    }
}

function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    calendarHtml += '<table style="width: 100%; height:100%;">'

    // 曜日の行を作成
    // for (let i = 0; i < weeks.length; i++) {
    //     calendarHtml += '<td>' + weeks[i] + '</td>'
    // }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
                dayCount++
            } else {
                calendarHtml += `<td class="calendar_td" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
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
    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');
    const topTimeElement = document.getElementById('top-time');

    saveDateInGlobal();
    saveSelectedDateInGlobal();
    setInterval(function(){
        saveDateInGlobal();
        let date  = new Date();
        currentDateElement.innerText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weeks[date.getDay()]}）`
        currentTimeElement.innerText = `${zeroPadding(date.getHours(), 2)}:${zeroPadding(date.getMinutes(), 2)}`
        topTimeElement.innerText = `${date.getFullYear()}年${date.getMonth() + 1}月`
        // 今日のスケジュールから検索し、現時刻で該当するものがあれば表示
    }, 2000)

    // 画角に合わせて高さ調整
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    let height = document.body.clientHeight - header.clientHeight;
    main.style.height = height + 'px';

    document.querySelector('#prev').addEventListener('click', moveCalendar)
    document.querySelector('#next').addEventListener('click', moveCalendar)

    document.addEventListener("click", function(e) {
        if(e.target.classList.contains("calendar_td")) {
            alert('クリックした日付は' + e.target.dataset.date + 'です')
        }
    })

    const dayBtn = document.getElementById('day-btn');
    const weekBtn = document.getElementById('week-btn');
    const monthBtn = document.getElementById('month-btn');

    dayBtn.addEventListener('click', (e) => {
        dayBtn.classList.add('active');
        weekBtn.classList.remove('active');
        monthBtn.classList.remove('active');

        const calendarDay = document.getElementById('calendar-day');
        const calendarWeek = document.getElementById('calendar-week');
        const calendarMonth = document.getElementById('calendar-month');
        const calendarHead = document.getElementById('calendar-head');

        calendarDay.classList.remove('display-none');
        calendarWeek.classList.add('display-none');
        calendarMonth.classList.add('display-none');

        calendarHead.style.padding = '0 80px';
        calendarHead.classList.add('flex-between');
        calendarHead.classList.remove('flex-center');
        calendarHead.classList.remove('week');
    }, false)

    weekBtn.addEventListener('click', () => {
        dayBtn.classList.remove('active');
        weekBtn.classList.add('active');
        monthBtn.classList.remove('active');

        const calendarDay = document.getElementById('calendar-day');
        const calendarWeek = document.getElementById('calendar-week');
        const calendarMonth = document.getElementById('calendar-month');
        const calendarHead = document.getElementById('calendar-head');

        calendarDay.classList.add('display-none');
        calendarWeek.classList.remove('display-none');
        calendarMonth.classList.add('display-none');

        calendarHead.style.padding = '0 33% 0 10%';
        calendarHead.classList.remove('flex-between');
        calendarHead.classList.add('flex-center');
        calendarHead.classList.add('week');
    }, false)

    monthBtn.addEventListener('click', () => {
        dayBtn.classList.remove('active');
        weekBtn.classList.remove('active');
        monthBtn.classList.add('active');
        
        const calendarDay = document.getElementById('calendar-day');
        const calendarWeek = document.getElementById('calendar-week');
        const calendarMonth = document.getElementById('calendar-month');
        const calendarHead = document.getElementById('calendar-head');

        calendarDay.classList.add('display-none');
        calendarWeek.classList.add('display-none');
        calendarMonth.classList.remove('display-none');
    })

    showCalendar(year, month);

    const today = new Date();
    saveSelectedDateInGlobal(`${today.getFullYear()}-${zeroPadding(today.getMonth()+1, 2)}-${zeroPadding(today.getDate(), 2)}`, currentDate.week);
    getDayEvents(`${today.getFullYear()}-${zeroPadding(today.getMonth()+1, 2)}-${zeroPadding(today.getDate(), 2)}`);
    const calendarHead = document.getElementById('calendar-head');
    calendarHead.innerHTML = createHeader(currentDate.year, currentDate.month)[currentDate.week];

    const scheduleElement = document.getElementById('schedule');
    scheduleElement.addEventListener('click', openNewSchedule);
    scheduleElement.addEventListener('touchend', openNewSchedule);
}
