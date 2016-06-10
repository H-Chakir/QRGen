// Mode indicators
var modeCode = {
    Numeric:1 << 0,
    Alpha:1 << 1,
    Byte:1 << 2,
    ECI:1 << 0 | 1 << 1 | 1 << 2,
    Kanji:1 << 3,
    FNC1:1 << 0 | 1 << 2,
    FNC2:1 << 1 | 1 << 3
};

// Error correction level
var errorCorrectLevel = {
    L: 0,
    M: 1,
    Q: 2,
    H: 3
};

function MyVanillaQR(options) {

    //AlphaNumerical Table
    var alphaNumTable = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'A':10,'B':11,'C':12,'D':13,'E':14,
        'F':15,'G':16,'H':17,'I':18,'J':19,'K':20,'L':21,'M':22,'N':23,'O':24,'P':25,'Q':26,'R':27,'S':28,'T':29,'U':30,
        'V':31,'W':32,'X':33,'Y':34,'Z':35,' ':36,'$':37,'%':38,'*':39,'+':40,'-':41,'.':42,'/':43,':':44};

    //Error correction characteristics
    var VersionErrorCarac = [

        // L
        // M
        // Q
        // H

        // 1
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],

        // 2
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],

        // 3
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],

        // 4
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],

        // 5
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],

        // 6
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],

        // 7
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],

        // 8
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],

        // 9
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],

        // 10
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],

        // 11
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],

        // 12
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],

        // 13
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],

        // 14
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],

        // 15
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],

        // 16
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],

        // 17
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],

        // 18
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],

        // 19
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],

        // 20
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],

        // 21
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],

        // 22
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],

        // 23
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],

        // 24
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],

        // 25
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],

        // 26
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],

        // 27
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],

        // 28
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],

        // 29
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],

        // 30
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],

        // 31
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],

        // 32
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],

        // 33
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],

        // 34
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],

        // 35
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],

        // 36
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],

        // 37
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],

        // 38
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],

        // 39
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],

        // 40
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ];

    var gexp = new Array(256);
    for (var i = 0; i < 8; i++) {
        gexp[i] = 1 << i;
    }
    for (i = 8; i < 256; i++) {
        gexp[i] = gexp[i - 4] ^ gexp[i - 5] ^ gexp[i - 6] ^ gexp[i - 8];
    }

    var glog = new Array(256);
    for(i = 0; i < 256; i++){
        glog[gexp[i]] = i;
    }
    glog[1]=0;

    var patternPosition = [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ];

    //canvas output types
    this.imageTypes = {
        "bmp"    : "image/bmp",
        "gif"    : "image/gif",
        "jpeg"   : "image/jpeg",
        "jpg"    : "image/jpg",
        "png"    : "image/png",
        "svg+xml": "image/svg+xml",
        "tiff"   : "image/tiff",
        "webp"   : "image/webp",
        "x-icon" : "image/x-icon"
    };

    this.QRframe = [];
    this.colors = ['white','black'];
    this.str = '' ;
    this.mode = -1;
    this.mask = -1;
    this.version = -1;
    this.width = 300;
    this.format = '';
    this.errorCorrect = errorCorrectLevel.H;
    this.ECICode = '';

    if ( typeof(options) !== 'undefined' ){
        this.str = options.str || '' ;
        this.width = options.width || 300;
        this.mask = options.mask || -1;
        this.mode = options.mode || -1;
        this.colors = options.colors || ['white','black'];
        this.version = options.version || -1;
        this.format = options.format || -1;
        this.errorCorrect = options.errorCorrect || errorCorrectLevel.H;
        this.ECICode = options.ECICode || '';
    }

    
    this.encodeDataQR = function(str){
        if(this.mode == -1){
            //Find mode if mode not given
            this.mode = this.selectMode(str);
        }
        
        if(this.version == -1){
            //Find Minimal version if version not given
            this.version = this.selectVersion(str);
        }
        else if(this.getDataStreamLength(str,this.mode,this.version) > getVersionMaxDataLength(this.errorCorrect,this.version))
        {
            throw new Error('the specified version can not support this data!')
        }
        var strResult ='';
        var i = 0;
        var chars = '';
        var bitLength = 0;
        var index =0;
        switch (this.mode)
        {
            case modeCode.Numeric:
                // Mode Indicator + Character Count Indicator
                strResult = CompleteNBit(this.mode.toString(2),4) + CompleteNBit(str.length.toString(2),getIndicBitsLength(this.mode,this.version));
                for( i = 0; i < str.length; i++){

                    chars = str[i];
                    // R = 4 if (D MOD 3) = 1
                    bitLength = 4;

                    if (str[i + 1]) {
                        chars += str[++i];
                        //  R = 7 if (D MOD 3) = 2
                        bitLength = 7;
                    }
                    if (str[i + 1]) {
                        chars += str[++i];
                        // R = 0 if (D MOD 3) = 0
                        bitLength = 10;
                    }
                    index = parseInt(chars, 10);
                    if (isNaN(index)) {
                        throw new Error("Invalid character: `" + chars + "`");
                    }
                    strResult += CompleteNBit(index.toString(2),bitLength);

                }
                break;
            case modeCode.Alpha:
                strResult = CompleteNBit(this.mode.toString(2),4) + CompleteNBit(str.length.toString(2),getIndicBitsLength(this.mode,this.version));
                for( i = 0; i < str.length; i++){
                    if (str[i + 1]) {
                        strResult += CompleteNBit((alphaNumTable[str[i].toUpperCase()] * 45 + alphaNumTable[str[++i].toUpperCase()]).toString(2),11);
                    }
                    else{
                        strResult += CompleteNBit((alphaNumTable[str[i].toUpperCase()]).toString(2),6);
                    }
                }
                break;
            case modeCode.ECI:
                var t = parseInt(this.ECICode,10);
                var ECINUM = ''; // UTF8 = ECI - 000026
                if(t < 128 ){ECINUM = '0' + CompleteNBit( t.toString(2),7);}
                else if(t < 16384 ){ECINUM = '10' + CompleteNBit( t.toString(2),14);}
                else if(t < 1000000 ){ECINUM = '110' + CompleteNBit( t.toString(2),21);}
                else { throw new Error('ECI Assignment number is bigger than 999 999')}
                strResult = CompleteNBit(this.mode.toString(2),4) + ECINUM + CompleteNBit(modeCode.Byte.toString(2),4) + CompleteNBit(str.length.toString(2),getIndicBitsLength(modeCode.Byte,this.version));
                for(t = 0; t < str.length; t++){
                    strResult += CompleteNBit(str.charCodeAt(t).toString(2),8);
                }
                break;
            case modeCode.Byte:
                strResult = CompleteNBit(this.mode.toString(2),4) + CompleteNBit(str.length.toString(2),getIndicBitsLength(this.mode,this.version));
                for(t = 0; t < str.length; t++){
                    strResult += CompleteNBit(str.charCodeAt(t).toString(2),8);
                }
                break;
        }
        
        i=0;
        while(i < 4 && strResult.length <= getVersionMaxDataLength(this.errorCorrect,this.version)){
            strResult   += '0';
            i++;
        }
        while(strResult.length % 8 != 0){
            strResult   += '0';
        }
        i = 0;
        while(strResult.length < getVersionMaxDataLength(this.errorCorrect,this.version))
        {
            if(i++%2==0){
                strResult   += '11101100';
            }
            else
            {
                strResult   += '00010001';
            }
        }
        return strResult;
    };

    this.generatePoly = function (order) {
        var result = [0,0];

        var i = 1;
        while(result.length <= order ){

            var tmp = new Array(result.length+1);
            for(var j = 0; j < tmp.length; j++){
                if(j == 0){
                    tmp[j] = 0;
                }
                else if( j == tmp.length -1){
                    tmp[j] = (result[result.length - 1] + i) % 255;
                }
                else{
                    tmp[j] = glog[parseInt((gexp[(result[j - 1] + i) % 255 ] ^ gexp[(result[j]) % 255]) % 256 + Math.floor((gexp[(result[j - 1] + i) % 255] ^ gexp[(result[j])%255])/256))];
                }

            }
            result = tmp;
            i++;
        }

        for(j = 0; j < result.length; j++){
            result[j] = gexp[result[j]];
        }
        
        return result;
    };
    
    this.divisionPoly = function (poly1,poly2) {
        var tmp1 = poly1.slice();
        var tmp2 = poly2.slice();

        if(poly2.length > poly1.length){
            return poly1;
        }

        var x = glog[poly1[0]];
        var y = glog[poly2[0]];

        for(var i = 0; i < tmp2.length; i++){
            tmp2[i] = gexp[((glog[tmp2[i]] + x) % 255)];
        }

        for( i = 0; i < tmp1.length; i++){
            if(tmp1[i] != 0)
            {
                tmp1[i] = gexp[((glog[tmp1[i]] + y) % 255)];
            }

        }
        
        for(i = 0; i < tmp2.length; i++){
            tmp1[i] = tmp1[i] ^  tmp2[i];
        }

        tmp1.shift();
        return this.divisionPoly(tmp1,poly2);
    };

    this.generateErrorCorrection = function (str) {
        var result = '';
        var dataBits = this.encodeDataQR(str);

        var maxLengthInterData = 0;
        var maxLengthInterError = 0;
        var InterleaveData = [];
        var InterleaveError = [];

        var coef = new Array(dataBits.length / 8);
        for( i = 0; i < coef.length; i++){
            coef[i] = parseInt(dataBits.substr(i * 8,8),2);
        }

        var carac = VersionErrorCarac[((this.version - 1) * 4) + this.errorCorrect];

        for( var i = 0; i < carac.length / 3; i++ ){
            for(var j = 0; j < carac[i * 3]; j++){
                var errorBlockLength = carac[3 * i + 1] - carac[3 * i + 2];

                // Separate Data Groups / blocks
                var Datablock = [];
                if(i > 0)
                {
                    Datablock = coef.slice((j*carac[i*3+2] + i * carac[(i - 1) * 3] * carac[ (i - 1) * 3 + 2]),(j*carac[i*3+2] + i * carac[(i - 1) * 3] * carac[ (i - 1) * 3 + 2]) + carac[i*3+2]);
                }
                else
                {
                    Datablock = coef.slice((j*carac[i*3+2] ),(j*carac[i*3+2]) + carac[i*3+2]);
                }


                /************** Get Max of Arrays to InterLeave  *****************/
                if(maxLengthInterData < Datablock.length){
                    maxLengthInterData = Datablock.length;
                }

                if(maxLengthInterError < errorBlockLength){
                    maxLengthInterError=errorBlockLength;
                }
                 /*********************************/

                /************ Add Data blocks before multiply by errorBlockLength *****************/
                InterleaveData.push(Datablock.slice());
                /*****************************/
                var t = Datablock.length + errorBlockLength;
                while(Datablock.length < t){
                    Datablock.push(0);
                }
                // Calculate Error Groups / blocks
                InterleaveError.push(this.divisionPoly(Datablock,this.generatePoly(errorBlockLength)));
            }
        }

        /****************** Interleave Data codewords ***********************/
        for(i = 0; i < maxLengthInterData; i++){
            for(j = 0; j < InterleaveData.length ; j++){
                if( i < InterleaveData[j].length ){
                    result += CompleteNBit(InterleaveData[j][i].toString(2),8);
                }
            }
        }
        /******************* Interleave Error codewords **********************/
        for(i = 0; i < maxLengthInterError; i++){
            for(j = 0; j < InterleaveError.length ; j++){
                if(i < InterleaveError[j].length){
                    result += CompleteNBit(InterleaveError[j][i].toString(2),8);
                }
            }
        }

        /***************** Add Remainder Bits if necessary ************************/
        if(this.version > 1 && this.version < 7 ){
            result += '0000000';
        }
        else if( (this.version > 13 && this.version < 21) || (this.version > 27 && this.version < 35)){
            result += '000';
        }
        else if( this.version > 20 && this.version < 28){
            result += '0000';
        }

        return result;
    };

    this.putForVerInfo = function (QR,errorCorrec,mask) {
        var bits = '';
        switch (errorCorrec){
            case errorCorrectLevel.L:
                bits+='01';
                break;
            case errorCorrectLevel.M:
                bits+='00';
                break;
            case errorCorrectLevel.Q:
                bits+='11';
                break;
            case errorCorrectLevel.H:
                bits+='10';
                break;
        }

        bits += CompleteNBit( mask.toString(2),3);

        var t = bits;
        // Add 0s so it s length = 15
        while(t.length < 15){
            t +='0';
        }

        if(t[0]=='0'){
            t = t.slice(1);
        }

        while(t.length > 10){
            var div = '10100110111';

            while(div.length != t.length){
                div+='0';
            }

            t = (parseInt(t,2) ^ parseInt(div,2)).toString(2);
        }

        bits += CompleteNBit(t,10);

        bits = CompleteNBit((parseInt(bits,2) ^ parseInt('101010000010010',2)).toString(2),15);

        // Reverse string
        bits = bits.split("").reverse().join("");

        for(var i = 0; i < 8; i++){
            QR[8][QR.length - 1 - i] = parseInt(bits[i]);

            if(i < 6){
                QR[i][8] = bits[i];
            }
            else{
                QR[i+1][8] = bits[i];
            }
        }

        for(i = 0; i < 7; i++){
            QR[QR.length - 7 + i][8] = parseInt(bits[i+8]);

            if(i == 0){
                QR[8][7] = bits[i+8];
            }
            else{
                QR[8][6-i] = bits[i+8];
            }
        }


        if(this.version > 6){
            bits = CompleteNBit(this.version.toString(2),6);

            t = bits;
            // Add 0s so it s length = 18
            while(t.length < 18){
                t +='0';
            }

            while(t[0]=='0'){
                t = t.slice(1);
            }

            while(t.length > 12){
                div = '1111100100101';

                while(div.length != t.length){
                    div+='0';
                }

                t = (parseInt(t,2) ^ parseInt(div,2)).toString(2);
            }

            bits += CompleteNBit(t,12);

            // Reverse string
            bits = bits.split("").reverse().join("");
            
            for(i = 0; i < bits.length; i++){
                QR[QR.length - 11 + i%3][ Math.floor(i/3)] = parseInt(bits[i]);
                QR[Math.floor(i/3)][QR.length - 11 + i%3] = parseInt(bits[i]);
            }
        }

        return QR;
    };

    this.generateQR = function () {

        if(this.version == -1){
            this.version = this.selectVersion(this.str);
        }

        var modules = (((this.version-1)*4)+21);
        this.QRframe = new Array(modules);

        for(var i=0; i < modules; i++){
            this.QRframe[i] =  new Array(modules);
        }

        this.putFinderPattern();
        this.putAlignPattern();
        this.putTimingPattern();
        this.putQRInformation();
        this.putData();

        var bestMask = 0;
        if(this.mask == -1){
            var newArray = [];
            for ( i = 0; i < this.QRframe.length; i++)
                newArray[i] = this.QRframe[i].slice();

            bestMask = chooseBestMask(newArray);
        }
        else{
            bestMask = this.mask;
        }


        applyMask(this.QRframe,bestMask);
        this.putForVerInfo(this.QRframe,this.errorCorrect,bestMask);
    };

    /******************** QR Utility *******************************/

    // Number of bits in Character Count Indicator 1-9, 10-26, 27-40
    var getIndicBitsLength = function(mode, version) {

        if (1 <= version && version < 10) {

            // 1 - 9

            switch (mode) {
                case modeCode.Numeric:
                    return 10;
                case modeCode.Alpha:
                    return 9;
                case modeCode.Byte:
                case modeCode.ECI:
                    return 8;
                case modeCode.Kanji:
                    return 8;
                default:
                    throw new Error("mode:" + mode);
            }

        } else if (version < 27) {

            // 10 - 26

            switch (mode) {
                case modeCode.Numeric:
                    return 12;
                case modeCode.Alpha:
                    return 11;
                case modeCode.Byte:
                case modeCode.ECI:
                    return 16;
                case modeCode.Kanji:
                    return 10;
                default:
                    throw new Error("mode:" + mode);
            }

        } else if (version < 41) {

            // 27 - 40

            switch (mode) {
                case modeCode.Numeric:
                    return 14;
                case modeCode.Alpha:
                    return 13;
                case modeCode.Byte:
                case modeCode.ECI:
                    return 16;
                case modeCode.Kanji:
                    return 12;
                default:
                    throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + version);
        }
    };

    var getVersionMaxDataLength = function (error,version) {
        var versionMaxLength = 0;

        //get Error correction characteristics for version/errorCorrectionLevel
        var versionModeArray = VersionErrorCarac[(version-1)*4 + error];
        var length = versionModeArray.length / 3;

        for(var i = 0; i < length; i++){
            versionMaxLength += versionModeArray[(i*3)] * versionModeArray[(i*3) + 2];
        }

        return versionMaxLength * 8;

    };

    this.getDataStreamLength = function (data,mode,version) {
        var indicator = getIndicBitsLength(mode,version);

        switch (mode){
            case modeCode.Numeric:
                var R = 0;
                if(data.length % 3 == 1 ){R = 4;}else if(data.length % 3 == 2){R = 7;}
                return 4 + indicator + 10 * Math.floor(data.length / 3) + R;
            case modeCode.Alpha:
                return 4 + indicator + 11 * Math.floor(data.length / 2) + 6 * (data.length % 2);
            case modeCode.Byte:
                return 4 + indicator + 8 * data.length;
            case modeCode.ECI:
                var t = parseInt(this.ECICode,10);
                var ECINUM = ''; // UTF8 = ECI - 000026
                if(t < 128 ){ECINUM = '0' + CompleteNBit( t.toString(2),7);}
                else if(t < 16384 ){ECINUM = '10' + CompleteNBit( t.toString(2),14);}
                else if(t < 1000000 ){ECINUM = '110' + CompleteNBit( t.toString(2),21);}
                else { throw new Error('ECI Assignment number is bigger than 999 999')}
                return 4 + ECINUM.length +(4 + indicator + 8 * data.length);
            case modeCode.Kanji:
                return 4 + indicator + 13 * data.length;
        }
    };

    this.selectMode = function (str) {
        if(isNumeric(str)){
            return modeCode.Numeric;
        }
        else if(isAlpha(str)){
            return modeCode.Alpha;
        }
        else{
            if(this.ECICode)
            {
                return modeCode.ECI;
            }
            else
            {
                return modeCode.Byte;
            }

        }

    };

    this.selectVersion = function (str) {
        if(this.mode == -1){
            //Find mode if mode not given
            this.mode = this.selectMode(str);
        }

        var version = 1;

        while(version < 41){
            if (this.getDataStreamLength(str,this.mode,version) < getVersionMaxDataLength(this.errorCorrect,version)){return version;}
            version++;
        }

        throw new Error('No version can support this data!')
    };
    
    var applyMask = function (QR,mask) {
        var version = (QR.length - 21) / 4;
        var patternAlign = patternPosition[version];

        var alignPos = [];

        for(var i = 0; i < patternAlign.length; i++ ){
            for(var j = 0; j < patternAlign.length; j++){
                var x = patternAlign[i];
                var y = patternAlign[j];

                if(!((x < 8 && y < 8 ) || (x > QR.length - 9 && y < 8) || (y > QR.length - 9 && x < 8))){
                    alignPos.push([x+3,y+3,x-3,y-3])
                }
            }

        }

        for( i = 0; i < QR.length; i++){
            for( j = 0; j < QR.length; j++){
                var inPattern = false;
                if( (i < 9 && j < 9 ) ||
                    (i < 9 && j > QR.length - 9 ) ||
                    (i > QR.length - 9 && j < 9 ) ||
                    (QR[i][j] == -1 ) ||
                    j == 6 ||
                    i ==6
                ){
                    continue;
                }

                for(var k = 0; k < alignPos.length && !inPattern; k++){
                    if(i < alignPos[k][0] && i > alignPos[k][2] && j < alignPos[k][1] && j > alignPos[k][3]){
                        inPattern = true;
                    }
                }
                if(!inPattern){
                    switch (mask){
                        case 0:
                            if( ( i + j ) % 2 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 1:
                            if(i % 2 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 2:
                            if(j % 3 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 3:
                            if( ( i + j ) % 3 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 4:
                            if( ( Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 5:
                            if(( ( i * j ) % 2) + ( ( i * j ) % 3 ) == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 6:
                            if(( ( ( i * j ) % 2) + ((i * j) % 3) ) % 2 == 0){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                        case 7:
                            if( ( ((i + j) % 2) + ((i * j) % 3) ) % 2 == 0 ){
                                QR[i][j] = +!QR[i][j];
                            }
                            break;
                    }
                }
            }
        }

        return QR;
    };

    var countPenalty = function (QR) {
        var penalty = 0;

        /**************** Evaluation Condition #1 ******************/
        // On Rows
        for(var i = 0; i < QR.length; i++){
            for(var j = 0; j < QR.length;j++){
                // Number of squares of the same color
                var k=0;
                while(QR[i][j] == QR[i][j + k] ){
                    k++;
                    if(j + k >= QR.length){break;}
                }

                penalty += +(k >= 5) * (k - 5 + 3);
                j = j+k-1;

            }
        }

        // On Columns
        for( i = 0; i < QR.length; i++){
            for( j = 0; j < QR.length;j++){
                // Number of squares of the same color
                k=0;
                while(QR[j][i] == QR[j + k][i] ){
                    k++;
                    if(j + k >= QR.length){break;}
                }

                penalty += +(k >= 5) * (k - 5 + 3);
                j = j+k-1;

            }
        }

        /**************** Evaluation Condition #2 ******************/
        // Number of Square 2*2
        k=0;
        for( i = 0; i < QR.length - 1; i++){
            for( j = 0; j < QR.length - 1;j++){
                if(QR[i][j]==QR[i+1][j] && QR[i][j]==QR[i][j+1] && QR[i][j]==QR[i+1][j+1]){
                    k++;
                }
            }
        }
        penalty += k * 3;

        /**************** Evaluation Condition #3 ******************/
        var T1 = [1,0,1,1,1,0,1,0,0,0,0];
        var T2 = [0,0,0,0,1,0,1,1,1,0,1];
        //Number of occurence of T1 and T2
        k = 0;

        // On Rows
        for( i = 0; i < QR.length; i++){
            for( j = 0; j < QR.length - 10;j++){
                // Array of 11
                var test = QR[i].slice(j,j+11);
                if(compareArrays(test,T1) || compareArrays(test,T2)){
                    k++;
                }
            }
        }

        // On Columns
        for( i = 0; i < QR.length; i++){
            for( j = 0; j < QR.length - 10;j++){
                // Array of 11
                test = [];
                for( var t= 0; t < 11; t++){
                    test.push(QR[j+t][i]);
                }
                if(compareArrays(test,T1) || compareArrays(test,T2)){
                    k++;
                }
            }
        }

        penalty += k * 40;

        /**************** Evaluation Condition #4 ******************/
        // Number of Dark squares
        k=0;
        // On Rows
        for( i = 0; i < QR.length; i++){
            for( j = 0; j < QR.length;j++){
                if(QR[i][j]==1){
                    k++;
                }
            }
        }

        // previous multiple of five of (k / (QR.length * QR.length)) * 100
        i = Math.floor( ( ( k / ( QR.length * QR.length ) ) * 100)/5) * 5 - 50;
        j = i + 5;

        if(Math.abs(i)/5 > Math.abs(j)/5){
            penalty += ( Math.abs(j) / 5 ) * 10;
        }
        else{
            penalty += ( Math.abs(i) / 5 ) * 10;
        }


        return penalty;
    };

    var chooseBestMask = function (QR) {
        var results = new Array(8);

        for(var i =0; i < 8; i++){
            results[i] = countPenalty(applyMask(QR,i));
        }

        return results.indexOf(Math.min.apply(Math,results));
    };

    this.putFinderPattern = function () {
        var position =[[3,3], [this.QRframe.length - 4, 3], [3,this.QRframe.length - 4]];
        for(var h = 0; h < position.length; h++ ){
            var x = position[h][0];
            var y = position[h][1];

            for(var i = 0; i < 5; i++){
                for(var j = 0; j < 2 * i + 1; j++){
                    if( x - i >= 0 && x - i < this.QRframe.length && y - i + j >= 0 && y - i + j < this.QRframe.length ){
                        this.QRframe[x - i][y - i + j] = +( i%2 == 1 || i == 0);
                    }
                    if( x + i >= 0 && x + i < this.QRframe.length && y - i + j >= 0 && y - i + j < this.QRframe.length ){
                        this.QRframe[x + i][y - i + j] = +( i%2 == 1 || i == 0);
                    }
                    if( x - i + j >= 0 && x - i + j < this.QRframe.length && y - i >= 0 && y - i < this.QRframe.length ){
                        this.QRframe[x - i + j][y - i ] = +( i%2 == 1 || i == 0);
                    }
                    if( x - i + j >= 0 && x - i + j < this.QRframe.length && y + i >= 0 && y + i < this.QRframe.length ){
                        this.QRframe[x - i + j][y + i] = +( i%2 == 1 || i == 0);
                    }
                }
            }
        }
    };

    this.putAlignPattern = function () {
        var position = patternPosition[this.version - 1];
        for(var h = 0; h < position.length; h++ ){

            for(var k = 0; k < position.length; k++){
                var x = position[h];
                var y = position[k];

                if(!((x < 8 && y < 8 ) || (x > this.QRframe.length - 9 && y < 8) || (y > this.QRframe.length - 9 && x < 8))){
                    for(var i = 0; i < 3; i++){
                        for(var j = 0; j < 2 * i + 1; j++){

                            this.QRframe[x - i][y - i + j] = +( i%2 == 0);

                            this.QRframe[x + i][y - i + j] = +( i%2 == 0);

                            this.QRframe[x - i + j][y - i ] = +( i%2 == 0 );

                            this.QRframe[x - i + j][y + i] = +( i%2 == 0);
                        }
                    }
                }
            }
        }
    };

    this.putTimingPattern = function () {
        for(var i = 7; i < this.QRframe.length - 8; i++ ){
            this.QRframe[6][i] = +(i%2==0) ;
            this.QRframe[i][6] = +(i%2==0) ;
        }
    };

    this.putQRInformation = function () {
        /**************** Reserve Format Information **********************/
        for(var i = 0; i < 9; i++){
            if(i != 6){
                this.QRframe[i][8] = -1;
                this.QRframe[8][i] = -1;
            }
        }

        for(i = 0; i < 8; i++){
            this.QRframe[8][this.QRframe.length - 1 - i] = -1;
            this.QRframe[this.QRframe.length - 1 - i][8] = -1;
        }

        // Dark Module
        this.QRframe[this.QRframe.length - 8][8] = 1;


        /***************** Reserve Version Information **********************/
        if(this.version > 6){
            for(i = 0; i < 3; i++){
                for(var j = 0; j < 6; j++){
                    this.QRframe[j][this.QRframe.length - 9 - i] = -1;
                    this.QRframe[this.QRframe.length - 9 - i][j] = -1;
                }
            }
        }
    };

    this.putData = function () {
        var shift = false;
        var direction = 0;
        var x = this.QRframe.length - 1;
        var y = this.QRframe.length - 1;
        var operator = [-1,1];
        var binaryStr = this.generateErrorCorrection(this.str);

        for(var j = 0; j < Math.ceil(binaryStr.length / 8); j++){
            var codeword = binaryStr.substr(j * 8, 8);

            var k = 0;
            var i = 0;
            var jump = 0;
            while(k < codeword.length){
                if( x + operator[direction % 2] *( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) < 0 || x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) > this.QRframe.length - 1 ){
                    y = !shift * (y - 2) + shift * (y - 1);
                    x = x + operator[direction % 2] * Math.floor((i-1)/2);
                    i=0;
                    direction++;
                    shift = false;
                }

                if( y + operator[+shift] * i%2 == 6){
                    y = y - 1;
                }

                if( (x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) == 6) ||
                    this.QRframe[x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) )][y + operator[+shift] * i%2] == -1 ||
                    this.QRframe[x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) )][y + operator[+shift] * i%2] == 1 ||
                    this.QRframe[x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) )][y + operator[+shift] * i%2] == 0 ||
                    (x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) > this.QRframe.length - 9 && y+ operator[+shift] *i%2 < 8) ||
                    (x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) < 8 && y+ operator[+shift] *i%2 > this.QRframe.length - 9) ||
                    (x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) ) < 8 && y+ operator[+shift] *i%2 < 8))
                {
                    jump++;

                }
                else{
                    this.QRframe[x + operator[direction % 2] * ( !shift * Math.floor(i/2) + shift * Math.ceil(i/2) )][y + operator[+shift] * i%2] = +parseInt(codeword[k]);
                    k++;
                }

                i++;
            }

            x = x + operator[direction % 2] * Math.floor(i/2);
            y = y + operator[+shift] * i%2;
            shift = (y > 6) * (y%2 !== 0) + !(y > 6) * (y%2 == 0);


        }
    };

    this.getTable = function () {
        var modules = (((this.version-1)*4)+21);

        /***************************  Convert QRFrame to table *********************************/
        var div = document.createElement('div');
        div.style.backgroundColor = this.colors[0];
        var moduleHeight = Math.floor((this.width ) / (modules + 8));
        div.style.padding = 4 * Math.ceil((this.width ) / (modules + 8))+'px';
        div.style.width = this.width + 'px';
        div.style.height = this.width+ 'px';
        div.style.boxSizing = 'border-box';

        var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';

        var tbody = document.createElement('tbody');

        for( i = 0; i < this.QRframe.length; i++){
            var row = document.createElement('tr');
            for(var j = 0; j < this.QRframe.length; j++){
                var cell = document.createElement('td');
                cell.style.width = moduleHeight + 'px';
                cell.style.height = moduleHeight + 'px';
                cell.style.padding = '0';
                cell.style.border = 'none';
                cell.style.backgroundColor = this.colors[this.QRframe[i][j]];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        div.appendChild(table);
        return div;
    };

    this.getCanvas = function () {
        var modules = (((this.version-1)*4)+21);
        var moduleHeight = Math.floor((this.width) / (modules + 8));
        var canvas = document.createElement('canvas');


        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.lineWidth=1;
            ctx.width = moduleHeight * modules;
            ctx.height = moduleHeight * modules;

            ctx.canvas.width = this.width;
            ctx.canvas.height = this.width;

            ctx.fillStyle = this.colors[0];
            ctx.fillRect (0, 0, this.width, this.width);

            for( i = 0; i < this.QRframe.length; i++){
                for(var j = 0; j < this.QRframe.length; j++){
                    if(this.QRframe[i][j]){
                        ctx.fillStyle = this.colors[this.QRframe[i][j]];
                        ctx.fillRect (moduleHeight * (j+4), moduleHeight * (i+4), moduleHeight, moduleHeight);
                    }
                }
            }
        }
        else{
            return false;
        }

        return canvas;
    };

    this.getImage = function() {
        var canvas = this.getCanvas();

        if(!canvas) {
           return;
        }

        //Check image output type
        var dataType = this.imageTypes[this.format];
        if(!dataType) {
            throw new Error(format + " is not a valid image type ");
        }

        //create image with src of QR code
        var image = new Image;
        image.src = canvas.toDataURL(dataType);
        return image;
    };

    /******************** General Utility *******************************/

    var compareArrays = function (t1,t2) {
        if(t1.length != t2.length){
            return false;
        }

        for(var i =0;i < t1.length; i++){
            if(t1[i] != t2[i]){
                return false;
            }
        }

        return true;
    };

    var CompleteNBit = function (str, n){
        if (n <= 0)
            throw new Error('N must be positive!');
        else if(n < String(str).length)
            throw new Error('str length must be inferior to N!');
        else if (n >= String(str).length){
            var result = str;
            while(result.length < n  ) {
                result = '0'+result;
            }
            return result;
        }
    };

    var isNumeric = function (n) {
        var numericValues = ['0','1','2','3','4','5','6','7','8','9'];
        for (var i = 0; i < n.length; i++){
            if(numericValues.indexOf(n[i]) < 0 ) return false;
        }
        return true;
    };

    var isAlpha = function (a) {
        a = a.toUpperCase();
        var AlphaValues = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E',
            'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            ' ','$','%','*','+','-','.','/',':'];
        for (var i = 0; i < a.length; i++){
            if(AlphaValues.indexOf(a[i]) < 0 ) return false;
        }
        return true;
    };

    this.generateQR(this.str);

}




