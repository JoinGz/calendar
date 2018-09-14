class Calendar {
  constructor(data) {
    this.config = Object.assign(
      {
        time: new Date()
      },
      data
    )
    this.ele = document.querySelector(this.config.ele)
    console.log(this.formatTime(new Date(),'yyyy-mm-dd'));
    
  }
  // 格式化时间
  formatTime(date, format) {
    let time = typeof date === 'string' ? new Date(date) : date  
    let year = time.getFullYear()
    let mouth = time.getMonth() + 1
    let day = time.getDate()
    let data = format.replace(/yyyy|mm|dd/gi, a => {
      switch (a) {
        case 'yyyy':
          return year
          break
        case 'mm':
          return mouth
          break
        case 'dd':
          return day
          break
        default:
          break
      }
    })
    return { data }
  }
}
export default Calendar
