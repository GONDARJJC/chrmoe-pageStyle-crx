const rxjs = (window as any).rxjs
const {of, fromEvent, from, switchMap, map, tap} = rxjs

const timeBtn = document.getElementById('timeBtn')
const timeSelect = document.getElementById('timeSelect') as HTMLSelectElement
const timeIpt = document.getElementById('time') as HTMLInputElement
const timeRes = document.getElementById('timeRes') as HTMLSpanElement
const timeBtn$ = fromEvent(timeBtn, 'click')


timeBtn$.pipe(
    switchMap(() => {
        return of(timeIpt.value)
    }),
    map((x: string) => Number(x)),
    map((x: number) => transTime(x, timeSelect.value))
).subscribe((x: string) => timeRes.innerHTML = x)

function transTime(t: number, secondType: string): string {
    let time = t

    if (secondType === 'second') {
        time = Math.floor(t * 1000)
    }
    const date = new Date(time)

    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const second = date.getSeconds()
    const milliseconds = date.getMilliseconds()

    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(second).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`
}


const dateBtn = document.getElementById('dateBtn')
const dateSelect = document.getElementById('dateSelect') as HTMLSelectElement
const dateIpt = document.getElementById('date') as HTMLInputElement
const dateRes = document.getElementById('dateRes') as HTMLSpanElement
const dateBtn$ = fromEvent(dateBtn, 'click')

dateBtn$.pipe(
    switchMap(() => {
        return of(dateIpt.value)
    }),
    map((x: string) => transDate(x, dateSelect.value))
).subscribe((x: string) => dateRes.innerHTML = x)

function transDate(dateStr: string, secondType: string): number {
    const date = new Date(dateStr)
    if (secondType === 'second') {
        return Math.floor(date.getTime() / 1000)
    }
    return date.getTime()

}

let hide = false
const utilBtn = document.getElementById('utilHead') as HTMLHeadElement
const utilBox = document.getElementById('utils') as HTMLHeadElement
fromEvent(utilBtn, 'click').subscribe(function () {
    if (!hide) {
        hide = true
        utilBox.style.overflowY = 'hidden'
        utilBox.style.height = '30px'
    } else {
        hide = false
        utilBox.style.height = '170px'
        utilBox.style.overflowY = 'scroll'
    }
})
