const axios = require("axios");
const cheerio = require("cheerio");

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(find, 'g'), replace);
}

function Tanggal(tanggal) {
    const tgl = tanggal.replace(/-.*/, "");
    const bln = tanggal.replace(/-([^-?]+)(?=(?:$|\?))/, "").replace(/.*?-/, "");
    const thn = tanggal.replace(/.*\-/, "");
    const result = {
        tanggal: tgl,
        bulan: bln,
        tahun: thn
    };
    return result;
}

/**
 * @params Nama
 * @returns {String} Arti dari nama
 */
async function artiNama(nama) {
    try {
        const { data } = await axios.get(
            `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`
        );
        const $ = cheerio.load(data);
        const isi = $("#body").text().split("Nama:")[0];
        const result = isi
            .replace(/\n/gi, "")
            .replace("ARTI NAMA", "")
            .replace("                                ", "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Kata kunci dari mimpi
 * @returns {String} Hasil pencarian dari kata kunci
 */
async function tafsirMimpi(mimpi) {
    try {
        const { data } = await axios.get(
            `https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`
        );
        const $ = cheerio.load(data);
        const cek = $("#body > font > i").text();
        const adaga = /Tidak ditemukan/g.test(cek) ? false : true;
        if (adaga) {
            const isi = $("#body")
                .text()
                .split(`Hasil pencarian untuk kata kunci: ${mimpi}`)[1]
                .replace(/\n\n\n\n\n\n\n\n\n/gi, "\n");
            const result = isi
                .replace(/\n/gi, "")
                .replace("       ", "")
                .replace("\"        ", "")
                .replace(/Solusi.*$/, "");
            const hasil = replaceAll(`${result}`, ".Mimpi", ".\nMimpi");
            return hasil;
        } else {
            return `Tidak ditemukan tafsir mimpi ${mimpi}. Cari dengan kata kunci yang lain..`;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * @params Nama anda
 * @params Nama pasangan
 * @returns {Promise<Object>} Nama anda, nama pasangan, sisi positif anda, sisi negatif anda, dan gambar love.
 */
async function Jodoh(nama1, nama2) {
    try {
        const { data } = await axios.get(
            `https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`
        );
        const $ = cheerio.load(data);
        const love = 'https://www.primbon.com/' + $('#body > img').attr('src');
        const res = $('#body').text().split(nama2)[1].replace('< Hitung Kembali', '').split('\n')[0];
        const positif = res.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ', '');
        const negatif = res.split('Sisi Negatif Anda: ')[1];
        const result = {
            namaAnda: nama1,
            namaPasangan: nama2,
            positif: positif,
            negatif: negatif,
            love: love
        };
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params tanggal jadian/pernikahan. contoh 1-2-2000
 * @returns {String} Hasil pencarian dari tanggal jadian/pernikahan.
 */
async function tanggaljadi(tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.get(
            `https://www.primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`
        );
        const $ = cheerio.load(data);
        const result = $("#body")
            .text()
            .replace("Karakteristik:", "\nKarakteristik:")
            .replace("Hubungan", "\nHubungan")
            .replace(/^\s*\n/gm, "")
            .replace(/< Hitung Kembali.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params nama artis indonesia
 * @params Tanggal lahir artis. contoh 1-2-2000
 * @returns {String} Hasil watak artis.
 */
async function watakartis(nama, tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.get(
            `https://www.primbon.com/selebriti.php?nama=${nama}&tgl=${tgl}&bln=${bln}&thn=${thn}&submit=submit#`
        );
        const $ = cheerio.load(data);
        const result = $("#body")
            .text()
            .replace(/^\s*\n/gm, "")
            .replace("Berdasarkan", "\nBerdasarkan")
            .replace("Nama:", "\nNama:")
            .replace("Tgl. Lahir:", "\nTanggal Lahir:")
            .replace("Weton:", "\nWeton:")
            .replace("Mongso:", "\nMongso:")
            .replace("Wuku:", "\nWuku:")
            .replace("Dibawah", "\n\nDibawah")
            .replace(/1\. /g, "\n1. ")
            .replace(/2\. /g, "\n2. ")
            .replace(/3\. /g, "\n3. ")
            .replace(/4\. /g, "\n4. ")
            .replace(/5\. /g, "\n5. ")
            .replace(/6\. /g, "\n6. ")
            .replace(/7\. /g, "\n7. ")
            .replace(/8\. /g, "\n8. ")
            .replace(/9\. /g, "\n9. ")
            .replace(/10\. /g, "\n10. ")
            .replace(/adalah:/g, "adalah:\n")
            .replace("KEADAAN UMUM", "\nKEADAAN UMUM")
            .replace("ALAM SEMESTA", "\nALAM SEMESTA")
            .replace("POSTUR TUBUH", "\nPOSTUR TUBUH")
            .replace("KEADAAN MASA KANAK-KANAK", "\nKEADAAN MASA KANAK-KANAK")
            .replace("KEADAAN MASA REMAJA", "\nKEADAAN MASA REMAJA")
            .replace("CIRI KHAS", "\nCIRI KHAS")
            .replace("IKATAN PERSAHABATAN", "\nIKATAN PERSAHABATAN")
            .replace("KEADAAN KESEHATAN", "\nKEADAAN KESEHATAN")
            .replace("PEKERJAAN YANG COCOK", "\nPEKERJAAN YANG COCOK")
            .replace("GAMBARAN TENTANG REJEKI", "\nGAMBARAN TENTANG REJEKI")
            .replace("SAAT YANG TEPAT", "\nSAAT YANG TEPAT")
            .replace("HOBI", "\nHOBI")
            .replace("JODO PINASTI", "\nJODO PINASTI")
            .replace("BATU PERMATA", "\nBATU PERMATA")
            .replace("WARNA YANG COCOK", "\nWARNA YANG COCOK")
            .replace("BUNGA", "\nBUNGA")
            .replace(/Di bawah ini.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Nama mu
 * @params Tanggal lahir. contoh 1-1-2000
 * @params Nama pasangan
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {String} Hasil ramalan jodoh.
 */
async function ramalanjodoh(nama1, tanggal1, nama2, tanggal2) {
    try {
        const tgl1 = Tanggal(tanggal1).tanggal;
        const bln1 = Tanggal(tanggal1).bulan;
        const thn1 = Tanggal(tanggal1).tahun;
        const tgl2 = Tanggal(tanggal2).tanggal;
        const bln2 = Tanggal(tanggal2).bulan;
        const thn2 = Tanggal(tanggal2).tahun;
        const { data } = await axios.post('https://primbon.com/ramalan_jodoh.php', {
            nama1: nama1,
            tgl1: tgl1,
            bln1: bln1,
            thn1: thn1,
            nama2: nama2,
            tgl2: tgl2,
            bln2: bln2,
            thn2: thn2,
            submit: " RAMALAN JODOH &#62;&#62; "
        });
        const $ = cheerio.load(data);
        const result = $('#body').text()
            .replace(/^\s*\n/gm, "")
            .replace(nama1, `\n${nama1}`)
            .replace(/Tgl\. Lahir:/g, "\nTanggal Lahir:")
            .replace(nama2, `\n${nama2}`)
            .replace("Dibawah", "\n\nDibawah")
            .replace(/1\. /g, "\n1. ")
            .replace(/2\. /g, "\n2. ")
            .replace(/3\. /g, "\n3. ")
            .replace(/4\. /g, "\n4. ")
            .replace(/5\. /g, "\n5. ")
            .replace(/6\. /g, "\n6. ")
            .replace(/7\. /g, "\n7. ")
            .replace(/8\. /g, "\n8. ")
            .replace(/9\. /g, "\n9. ")
            .replace(/10\. /g, "\n10. ")
            .replace(/\*/s, "\n\n*")
            .replace(/< Hitung Kembali.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {Promise<Object>} Penjelasan, dan gambar statistik.
 */
async function rejekiweton(tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.post('https://primbon.com/rejeki_hoki_weton.php', {
            tgl: tgl,
            bln: bln,
            thn: thn,
            submit: " Submit! "
        });
        const $ = cheerio.load(data);
        const res = $('#body').text()
            .replace(/^\s*\n/gm, "")
            .replace("Hari Lahir:", "\nHari Lahir:")
            .replace("Seseorang", "\nSeseorang")
            .replace("Fluktuasi", "\n\nFluktuasi")
            .replace("Hover\n", "")
            .replace(/< Hitung Kembali.*$/s, "");
        const stats = 'https://www.primbon.com/' + $('#body > span > img').attr('src');
        const result = {
            penjelasan: res,
            statistik: stats
        };
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Nama
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function kecocokannama(nama, tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.post('https://primbon.com/kecocokan_nama.php', {
            nama: nama,
            tgl: tgl,
            bln: bln,
            thn: thn,
            kirim: " Submit! "
        });
        const $ = cheerio.load(data);
        const result = $('#body').text()
            .replace(/^\s*\n/gm, "")
            .replace("Tgl. Lahir:", "\nTanggal Lahir:")
            .replace(/< Hitung Kembali.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Tanggal. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function haribaik(tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.post('https://primbon.com/petung_hari_baik.php', {
            tgl: tgl,
            bln: bln,
            thn: thn,
            submit: " Submit! "
        });
        const $ = cheerio.load(data);
        const result = $('#body').text()
            .replace(/^\s*\n/gm, "")
            .replace("Watak", "\nWatak")
            .replace("Kamarokam", "Kamarokam\n")
            .replace(thn, `${thn}\n`)
            .replace(/< Hitung Kembali.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * @params Tanggal. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function harilarangan(tanggal) {
    try {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        const { data } = await axios.post('https://primbon.com/hari_sangar_taliwangke.php', {
            tgl: tgl,
            bln: bln,
            thn: thn,
            kirim: " Submit! "
        });
        const $ = cheerio.load(data);
        const result = $('#body').text()
            .replace(/^\s*\n/gm, "")
            .replace(tgl, `\n${tgl}`)
            .replace("Termasuk", "\nTermasuk")
            .replace(/Untuk mengetahui.*$/s, "");
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    artiNama,
    tafsirMimpi,
    Jodoh,
    tanggaljadi,
    watakartis,
    ramalanjodoh,
    rejekiweton,
    kecocokannama,
    haribaik,
    harilarangan
};
