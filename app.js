"use strict"

const ratio = 0.6
const spies = document.querySelectorAll("[data-spy]")

let observer = null

/**
 * 
 * @param {HTMLElement} elem 
 */
const activate = function(elem) {
    const id = elem.getAttribute("id")
    const anchor = document.querySelector(`a[href="#${id}"]`)
    if(anchor === null) {
        return null
    }
    anchor.parentElement
        .querySelectorAll(".active")
        .forEach(node => node.classList.remove("active"))

    anchor.classList.add("active")
}

/**
 * 
 * @param {IntersectionObserverEntry[]} entries 
 * @param {IntersectionObserver} observer 
 */
 const callback = function(entries, observer) {
    entries.forEach(entry => {
        if(entry.intersectionRatio > 0) {
            activate(entry.target)
        }
    })
}
 /**
  * 
  * @param {NodeListOf.<Element>} elements 
  */
const observe = function(elements) {
    if(observer !== null) {
        elements.forEach(element => { observer.unobserve(element) })
    }
    const y = Math.round(window.innerHeight * ratio)
    observer = new IntersectionObserver(callback, {
        rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px` // define a line of 1 px of height, when an element is inside this line it's active
    })
    elements.forEach(element => observer.observe(element))
}

/**
 * 
 * @param {Function} callback 
 * @param {number} delay 
 * @returns {Function}
 */
const debounce = function(callback, delay) {
    let timer
    return function() {
        const args = arguments
        const context = this
        window.clearTimeout(timer)
        timer = window.setTimeout(function() {
            callback.apply(context, args)
        }, delay)
    }
}

if (spies.length > 0) {
    observe(spies)
    let windowH = window.innerHeight
    window.addEventListener("resize", debounce(() =>  {
        if (window.innerHeight !== windowH) {
            observe(spies)
            windowH = window.innerHeight
        }
    }, 500))
}

