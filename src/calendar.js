class Calendar {
  constructor(data) {
    this.config = Object.assign({
        time: new Date()
      },
      data
    );
    this.config.time = typeof this.config.time === 'object' ? this.config.time : new Date(this.config.time)
    this.showTime = typeof this.config.time === 'object' ? this.config.time : new Date(this.config.time)
    this.ele = document.querySelector(this.config.ele);
    // 第一行显示
    this.calendarWeeks = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ];
    // 一个月最大
    this.maxDay = 31;
    console.log(this.showTime);

    console.log(this._formatTime(this.config.time, 'yyyy-mm-dd'));
    // 最大日期
    this.calendarMax = this._formatTime(
      new Date(8640000000000000),
      'yyyy-MM-dd'
    ).data;
    // 最小日期
    this.calendarMin = '100-01-01';
    // 日历行数
    this.calendarRow = 6;
    // 要显示的日期数
    this.calendarDaysCount = this.calendarWeeks.length * this.calendarRow;
    // 所有要展示的天数
    this.showDays = [];
    this._initShowDays(this.config.time);
    this._renderDOM()
    this._event()
  }
  // 格式化时间
  _formatTime(time, format) {
    let mytime = typeof time === 'string' ? new Date(time) : time;
    let year = mytime.getFullYear();
    let month = mytime.getMonth() + 1;
    let date = mytime.getDate();
    let day = mytime.getDay();
    let data = format.replace(/yyyy|mm|dd/gi, a => {
      a = a.toLowerCase(); // 为了匹配switch
      switch (a) {
        case 'yyyy':
          return year;
          break;
        case 'mm':
          return month < 10 ? '0' + month : month;
          break;
        case 'dd':
          return date < 10 ? '0' + date : date;
          break;
      }
    });
    return {
      data,
      year,
      month,
      date,
      day
    };

  }
  _initShowDays(date) {
    // (1).先处理上个月的数据
    this._managePre(date)
    // (2).把这个月的数据放入数组
    this._manageNow(date)
    // (3).补完最后的
    this._manageNext(date)
    console.log(this.showDays);
  }
  // 上个月的最后一天
  _getLastDay(date) {
    // 月份不用减一,0就是上月最后一天
    return new Date(date.getFullYear(), date.getMonth(), 0)
  }
  // 这个月的最后一天 (+1就是下个月的第零天)
  _getMonthDay(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }
  // 每个月的第一天
  _getFirstDay(date) {
    // 月份不用减一本来就是获取的这个月的
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }
  _addArr(year, month, start, end, className) {
    for (let i = start; i <= end; i++) {
      this.showDays.push({
        year,
        month,
        date: i,
        className
      })
    }
  }
  _managePre(date) {
    // 这个月是星期几开始
    // 一排7个；从星期几开始表示站了几个；7-站了几个就是剩余的然后加个1，因为最后一个也要位置
    // 7 - (7 - this._getFirstDay(date).getDay() +1)
    let day = 7 - (8 - this._getFirstDay(date).getDay())
    // 上个月的最后一天
    let end = this._getLastDay(date).getDate()
    // end-6 = end - 7 +1 (+1是因为最有以为也要站位)
    // day小于零正好是星期天开始一个月的第一天
    let start = day<0 ? end-6 : end - day
    console.log(`start:${start},${day},${end}`);
    
    // 这是上一年的,所以如果现在是1月(getMonth就是0);就要-1获取上一年
    let year = date.getMonth() < 1 ? date.getFullYear - 1 : date.getFullYear()
    // 月份不减一 因为本来少1
    let month = date.getMonth() < 1 ? 12 : date.getMonth()
    this._addArr(year, month, start, end, 'isPre')
  }
  _manageNow(date) {
    let end = this._getMonthDay(date).getDate()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    this._addArr(year, month, 1, end, 'isCurrent')
  }
  _manageNext(date) {
    let year = date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear()
    // month+1>11 0 : date.getMonth+1 会出现month = 0;所以要全部加1
    let month = date.getMonth() + 2 > 12 ? 1 : date.getMonth() + 2
    this._addArr(year, month, 1, this.calendarDaysCount - this.showDays.length, 'isNext')
  }
  _renderDOM() {
    let template = `
    <div id="gzCalendar">
      <div class="gzTitle">
        {{title}}
      </div>
      <div class="gzContent">
        {{weeks}}
        {{content}}
      </div>
    </div>
    `
    template = template.replace('{{title}}', (a) => {
      return `<a href="javascript:;" class="gz-pre">&lt;</a>
      <span>
        ${this._formatTime(this.config.time, 'yyyy-mm').data}
      <span>
      <a href="javascript:;" class="gz-next">&gt;</a>
      `
    }).replace(/\{\{weeks\}\}/, () => {
      let html = ''
      this.calendarWeeks.forEach(v => {
        html += `<li>${v}</li>`
      })
      return `<ul class="clearfix">${html}</ul>`
    }).replace(/\{\{content\}\}/, () => {
      let html = ''
      let num = this._formatTime(this.config.time, 'yyyy-mm-dd').date
      this.showDays.forEach(v => {
        if (v.className === 'isCurrent') {
          let date = `${v.year}-${v.month}-${v.date}`
          if (this._formatTime(new Date(date), 'yyyy-mm-dd').data === this._formatTime(this.showTime, 'yyyy-mm-dd').data) {
            html += `<li class="select">${v.date}</li>`
          } else {
            html += `<li class="${v.className}">${v.date}</li>`
          }
        }else{
          html += `<li class="${v.className}">${v.date}</li>`
        }

      })
      return `<ul class="clearfix gzDay">${html}</ul>`
    })
    this.ele.innerHTML = template
  }
  _event() {
    // 点击本月的事件
    let li = document.querySelector(`${this.config.ele} .gzDay`)
    li.addEventListener('click', (e) => {
      e = e || window.event
      let target = e.target || e.srcElement
      if (target.className === "isCurrent") {
        try {
          let current = document.querySelector(`${this.config.ele} .select`)
          current.className = 'isCurrent'
        } catch (error) {

        }
        let {
          data
        } = this._formatTime(this.config.time, 'yyyy-mm')
        let value = target.textContent < 10 ? '0' + target.textContent : target.textContent
        data = `${data}-${value}`
        let currentAll = document.querySelectorAll(`${this.config.ele} .isCurrent`)
        currentAll[value - 1].className = 'select'
        console.log(data)
      } else if (target.className === "isPre") {
        let {
          year,
          month
        } = this._formatTime(this.config.time, 'yyyy-mm-dd')
        let value = target.textContent < 10 ? '0' + target.textContent : target.textContent
        month--;
        if (month < 1) {
          year--;
          month = 12
        }
        this.showDays = [];
        this.config.time = new Date(year, month - 1);
        console.log(value);
        this.showTime = new Date(year, month - 1, value)
        this._initShowDays(new Date(year, month - 1));
        this._renderDOM()
        this._event()
      } else if (target.className === "isNext") {
        let {
          year,
          month
        } = this._formatTime(this.config.time, 'yyyy-mm-dd')
        month++;
        if (month > 12) {
          year++;
          month = 1
        }
        let value = target.textContent < 10 ? '0' + target.textContent : target.textContent
        this.showDays = [];
        this.config.time = new Date(year, month - 1)
        this.showTime = new Date(year, month - 1, value)
        this._initShowDays(new Date(year, month - 1));
        this._renderDOM()
        this._event()
      }
    })
    // pre事件
    this._eventPre()
    // next事件
    this._eventNext()
  }
  _eventPre() {
    let pre = document.querySelector(`${this.config.ele} .gz-pre`)
    pre.addEventListener('click', () => {
      let {
        year,
        month
      } = this._formatTime(this.config.time, 'yyyy-mm-dd')
      month--;
      if (month < 1) {
        year--;
        month = 12
      }
      this.showDays = [];
      this.config.time = new Date(year, month - 1)
      this._initShowDays(new Date(year, month - 1));
      this._renderDOM()
      this._event()
    })
  }
  _eventNext() {
    let next = document.querySelector(`${this.config.ele} .gz-next`)
    next.addEventListener('click', () => {
      let {
        year,
        month
      } = this._formatTime(this.config.time, 'yyyy-mm-dd')
      month++;
      if (month > 12) {
        year++;
        month = 1
      }
      this.showDays = [];
      this.config.time = new Date(year, month - 1)
      this._initShowDays(new Date(year, month - 1));
      this._renderDOM()
      this._event()
    })
  }
}
export default Calendar;