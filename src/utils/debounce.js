export default function debounce(func) {
  var wait =
    arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1]

  var timeout = void 0
  return function () {
    var _this = this

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(_this, args)
    }, wait)
  }
}
