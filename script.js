
        function loadData(lineCode) {
            fetch('https://api.darktornado.net/subway/jp/toei?line=' + lineCode)
                .then((response) => response.json())
                .then((data) => {
                    createMap(data, lineCode);
                });
        }

        function createMap(data, lineCode) {
            document.getElementById('help').style.display = 'none';
            if (lineCode == 'E') return createOedoLine(data);
            var m = 100;
            var height = m * data.length;
            var color = {
                'A': '#FF535F',
                'I': '#0067B0',
                'S': '#9FB01C'
                // 'E': '#CF3366'
            };
            var src = '<svg viewbox="0 0 600 ' + height + '" >';
            src += '<line x1="50" y1="10" x2="50" y2="' + (height - 10) + '" stroke="' + color[lineCode] + '" />';
            data.forEach((e, i) => {
                src += text(100, m * i + m / 2, e.stn, '#000000', 30);
                src += train(30, m * i + m / 2, e.up, 'up');
                src += train(70, m * i + m / 2, e.dn, 'dn');
            });
            document.getElementById('map').innerHTML = src;
        }

        function createOedoLine(data) {
            var m = 100;
            var height = m * data.length;
            var src = '<svg viewbox="0 0 600 2520" >';
            src += '<polyline points="50,10 50,2490 60,2500 540,2500 550,2490 550,1100 540,1090 160,1090 150,1080 150,1020" fill="none" stroke="#CF3366" />';
            for (var n = 1; n < 14; n++) {
                var y = m * n + m + m * 10;
                src += text(500, y, data[n].stn, '#000000', 24, 'end');
                src += train(520, y, data[n].up, 'up');
                src += train(580, y, data[n].dn, 'dn');
            }
            for (var n = 14; n < 28; n++) {
                var y = m * data.length - (m * n + m / 2);
                src += text(100, y, data[n].stn, '#000000', 24);
                src += train(70, y, data[n].up, 'dn');
                src += train(30, y, data[n].dn, 'up');
            }
            var n = 28;
            var y = m * data.length - (m * n + m / 2);
            src += text(200, y, data[n].stn, '#000000', 30);
            src += train(70, y, data[n].up, 'dn');
            src += train(30, y, data[n].dn, 'up');
            src += train(170, y, data[0].up, 'dn');
            src += train(130, y, data[0].dn, 'up');
            for (var n = 29; n < data.length; n++) {
                var y = m * data.length - (m * n + m / 2);
                src += text(100, y, data[n].stn, '#000000', 30);
                src += train(70, y, data[n].up, 'dn');
                src += train(30, y, data[n].dn, 'up');
            }
            document.getElementById('map').innerHTML = src;
        }

        function text(x, y, stn, color, size, align) {
            if (align == undefined) align = 'start';
            var style = '"';
            style += 'font-size: ' + size + 'px;'
            style += 'text-anchor: ' + align + ';'
            style += '"';
            return '<text style=' + style + ' x=' + x + ' y=' + y + ' fill=' + color + '\'>' + stn + '</text>';
        }

        function train(x, y, data, updn) {
            if (data.length == 0) return '';
            x -= 10;
            y -= 30;
            var file = "images/train_" + updn + "_" + (data[0].type == '보통' ? 0 : 1) + ".png";
            return "<image xlink:href='" + file + "' x='" + x + "' y='" + y + "' width='20px'/>";
        }