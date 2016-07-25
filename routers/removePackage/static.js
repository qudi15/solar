;function replaceVal(_name, _value) {
    var _have = false;
    for (var i = 0; i < dojoConfig.packages.length; i++) {
        if (dojoConfig.packages[i].name == _name) {
            dojoConfig.packages[i].location = _value;
            _have = true;
        }
    };
    if (!_have) {
        var _obj = new Object();
        _obj.name = _name;
        _obj.location = _value;
        dojoConfig.packages.push(_obj);
    }
}

try {
    for (var i = 0; i < ismppacages.length; i++) {
        if (ismppacages[i].isPackaged) {
            replaceVal(ismppacages[i].namespace, ismppacages[i].location);
        }
    };
} catch(error) {
} 