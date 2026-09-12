// ============================================
// KALKULATOR SHOPEE
// ============================================

let produkTerpilih = null;


// ============================================
// PENGATURAN DEFAULT
// ============================================

const pengaturanDefault = {
    potonganShopee: 18.25,
    biayaProses: 1250,
    packing: 1000,
    riskReserve: 2,
    targetProfit: 10,
    efektivitasIklan: 70,
    roasAcuan: 7
};


// ============================================
// SAAT HALAMAN DIBUKA
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const pengaturan = {
        potonganShopee: document.getElementById("potonganShopee"),
        biayaProses: document.getElementById("biayaProses"),
        packing: document.getElementById("packing"),
        riskReserve: document.getElementById("riskReserve"),
        targetProfit: document.getElementById("targetProfit"),
        efektivitasIklan: document.getElementById("efektivitasIklan"),
        roasAcuan: document.getElementById("roasAcuan")
    };

    if (pengaturan.potonganShopee)
        pengaturan.potonganShopee.value = pengaturanDefault.potonganShopee;

    if (pengaturan.biayaProses)
        pengaturan.biayaProses.value = pengaturanDefault.biayaProses;

    if (pengaturan.packing)
        pengaturan.packing.value = pengaturanDefault.packing;

    if (pengaturan.riskReserve)
        pengaturan.riskReserve.value = pengaturanDefault.riskReserve;

    if (pengaturan.targetProfit)
        pengaturan.targetProfit.value = pengaturanDefault.targetProfit;

    if (pengaturan.efektivitasIklan)
        pengaturan.efektivitasIklan.value = pengaturanDefault.efektivitasIklan;

    if (pengaturan.roasAcuan)
        pengaturan.roasAcuan.value = pengaturanDefault.roasAcuan;

    isiDaftarProduk();
    buatIndikatorHPP();

    // Pencarian Kelola HPP
    const cari = document.getElementById("cariHPP");

    if (cari) {
        cari.addEventListener("input", function () {
            tampilkanDaftarHPP();
        });
    }
});


// ============================================
// DAFTAR PRODUK
// ============================================

function isiDaftarProduk() {

    const daftar = document.getElementById("daftarProduk");

    if (!daftar) return;

    daftar.innerHTML = "";

    produkData.forEach(function (produk) {

        const option = document.createElement("option");

        option.value =
            produk.sku + " - " + produk.nama;

        daftar.appendChild(option);
    });
}


// ============================================
// INDIKATOR HPP
// ============================================

function buatIndikatorHPP() {

    const hppInput = document.getElementById("hpp");

    if (!hppInput) return;

    let indikator =
        document.getElementById("indikatorHPP");

    if (!indikator) {

        indikator = document.createElement("div");

        indikator.id = "indikatorHPP";

        indikator.style.fontSize = "12px";
        indikator.style.marginTop = "6px";
        indikator.style.marginBottom = "10px";

        hppInput.insertAdjacentElement(
            "afterend",
            indikator
        );
    }

    updateIndikatorHPP();
}


// ============================================
// UPDATE INDIKATOR HPP
// ============================================

function updateIndikatorHPP() {

    const indikator =
        document.getElementById("indikatorHPP");

    const hppMasterInput =
        document.getElementById("hppMaster");

    const hppAktifInput =
        document.getElementById("hpp");

    if (
        !indikator ||
        !hppMasterInput ||
        !hppAktifInput
    ) {
        return;
    }

    const hppMaster =
        Number(hppMasterInput.value);

    const hppAktif =
        Number(hppAktifInput.value);

    if (
        hppMaster <= 0 ||
        hppAktif <= 0
    ) {
        indikator.textContent = "";
        return;
    }

    if (hppAktif === hppMaster) {

        indikator.textContent =
            "✓ HPP Aktif sama dengan HPP Master";

        indikator.style.fontWeight = "500";

    } else {

        const selisih =
            hppAktif - hppMaster;

        const teksSelisih =
            selisih > 0
                ? "naik " + rupiah(selisih)
                : "turun " + rupiah(Math.abs(selisih));

        indikator.textContent =
            "⚠ HPP Aktif berbeda dari HPP Master (" +
            teksSelisih +
            ")";

        indikator.style.fontWeight = "600";
    }
}


// ============================================
// PILIH PRODUK
// ============================================

function pilihProduk() {

    const inputElement =
        document.getElementById("produk");

    const hppMasterInput =
        document.getElementById("hppMaster");

    const hppAktifInput =
        document.getElementById("hpp");

    if (!inputElement) return;

    const input =
        inputElement.value
            .trim()
            .toLowerCase();

    if (input === "") {

        produkTerpilih = null;

        hppMasterInput.value = "";
        hppAktifInput.value = "";

        updateIndikatorHPP();

        return;
    }

    const produk =
        produkData.find(function (item) {

            const sku =
                String(item.sku)
                    .toLowerCase();

            const nama =
                String(item.nama)
                    .toLowerCase();

            const gabungan =
                (
                    item.sku +
                    " - " +
                    item.nama
                ).toLowerCase();

            return (
                sku === input ||
                nama === input ||
                gabungan === input ||
                sku.includes(input) ||
                nama.includes(input)
            );
        });

    if (!produk) {

        produkTerpilih = null;

        hppMasterInput.value = "";
        hppAktifInput.value = "";

        updateIndikatorHPP();

        return;
    }

    produkTerpilih = produk;

    // HPP MASTER
    hppMasterInput.value =
        produk.hpp;

    // HPP AKTIF
    const hppTersimpan =
        localStorage.getItem(
            "hpp_" + produk.sku
        );

    if (hppTersimpan !== null) {

        hppAktifInput.value =
            Number(hppTersimpan);

    } else {

        hppAktifInput.value =
            produk.hpp;
    }

    updateIndikatorHPP();
}


// ============================================
// SIMPAN HPP AKTIF
// ============================================

function simpanHPP() {

    if (!produkTerpilih) {

        alert(
            "Pilih produk terlebih dahulu."
        );

        return;
    }

    const hppInput =
        document.getElementById("hpp");

    const hppBaru =
        Number(hppInput.value);

    if (
        !Number.isFinite(hppBaru) ||
        hppBaru <= 0
    ) {

        alert(
            "HPP Aktif harus lebih dari 0."
        );

        return;
    }

    localStorage.setItem(
        "hpp_" + produkTerpilih.sku,
        hppBaru
    );

    updateIndikatorHPP();

    alert(
        "HPP Aktif berhasil disimpan."
    );
}


// ============================================
// KEMBALIKAN KE MASTER
// ============================================

function kembalikanHPPMaster() {

    if (!produkTerpilih) {

        alert(
            "Pilih produk terlebih dahulu."
        );

        return;
    }

    const konfirmasi =
        confirm(
            "Kembalikan HPP Aktif ke HPP Master?"
        );

    if (!konfirmasi) return;

    localStorage.removeItem(
        "hpp_" + produkTerpilih.sku
    );

    document.getElementById("hpp").value =
        produkTerpilih.hpp;

    updateIndikatorHPP();

    alert(
        "HPP Aktif telah dikembalikan ke HPP Master."
    );
}


// ============================================
// KELOLA HPP
// ============================================

function tampilkanKelolaHPP() {

    const panel =
        document.getElementById("kelolaHPP");

    if (!panel) return;

    if (
        panel.style.display === "none" ||
        panel.style.display === ""
    ) {

        panel.style.display = "block";

        tampilkanDaftarHPP();

    } else {

        panel.style.display = "none";
    }
}


// ============================================
// TAMPILKAN DAFTAR HPP
// ============================================

function tampilkanDaftarHPP() {

    const container =
        document.getElementById("daftarHPP");

    const input =
        document.getElementById("cariHPP");

    if (!container) return;

    const kata =
        input
            ? input.value
                .trim()
                .toLowerCase()
            : "";

    // FILTER SKU / NAMA
    const hasil =
        produkData.filter(function (produk) {

            const sku =
                String(produk.sku || "")
                    .toLowerCase()
                    .trim();

            const nama =
                String(produk.nama || "")
                    .toLowerCase()
                    .trim();

            return (
                kata === "" ||
                sku.includes(kata) ||
                nama.includes(kata)
            );
        });

    container.innerHTML = "";

    // TIDAK DITEMUKAN
    if (hasil.length === 0) {

        container.innerHTML = `
            <div style="
                padding:15px;
                text-align:center;
                font-size:13px;
            ">
                Produk tidak ditemukan.
            </div>
        `;

        return;
    }

    // MAKSIMAL 50
    const produkTampil =
        hasil.slice(0, 50);

    produkTampil.forEach(function (produk) {

        const hppTersimpan =
            localStorage.getItem(
                "hpp_" + produk.sku
            );

        const hppAktif =
            hppTersimpan !== null
                ? Number(hppTersimpan)
                : Number(produk.hpp);

        const berbeda =
            hppAktif !==
            Number(produk.hpp);

        const item =
            document.createElement("div");

        item.style.padding = "10px 0";
        item.style.borderBottom =
            "1px solid #eee";

        item.innerHTML = `

            <div style="
                font-weight:600;
                font-size:13px;
            ">
                ${produk.sku}
            </div>

            <div style="
                font-size:12px;
                margin:3px 0 8px;
            ">
                ${produk.nama}
            </div>

            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:6px;
            ">

                <div>

                    <small>
                        HPP Master
                    </small>

                    <div>
                        ${rupiah(produk.hpp)}
                    </div>

                </div>

                <div>

                    <small>
                        HPP Aktif
                    </small>

                    <input
                        type="number"
                        id="hppEdit_${produk.sku}"
                        value="${hppAktif}"
                        style="
                            width:100%;
                            box-sizing:border-box;
                        "
                    >

                </div>

            </div>

            ${
                berbeda
                    ? `
                        <div style="
                            font-size:12px;
                            margin-top:5px;
                            font-weight:600;
                        ">
                            ⚠ Berbeda dari Master
                        </div>
                    `
                    : ""
            }

            <button
                type="button"
                onclick="simpanHPPProduk('${produk.sku}')"
                style="
                    width:100%;
                    margin-top:8px;
                "
            >
                SIMPAN
            </button>

        `;

        container.appendChild(item);
    });

    // INFORMASI JUMLAH
    const info =
        document.createElement("p");

    info.style.fontSize = "12px";
    info.style.textAlign = "center";

    if (hasil.length > 50) {

        info.textContent =
            "Ditemukan " +
            hasil.length +
            " produk. Menampilkan 50 pertama.";

    } else {

        info.textContent =
            "Ditemukan " +
            hasil.length +
            " produk.";
    }

    container.appendChild(info);
}


// ============================================
// SIMPAN HPP DARI KELOLA HPP
// ============================================

function simpanHPPProduk(sku) {

    const input =
        document.getElementById(
            "hppEdit_" + sku
        );

    if (!input) return;

    const nilai =
        Number(input.value);

    if (
        !Number.isFinite(nilai) ||
        nilai <= 0
    ) {

        alert(
            "HPP harus lebih dari 0."
        );

        return;
    }

    localStorage.setItem(
        "hpp_" + sku,
        nilai
    );

    // Jika sedang memilih produk yang sama
    if (
        produkTerpilih &&
        produkTerpilih.sku === sku
    ) {

        document.getElementById("hpp").value =
            nilai;

        updateIndikatorHPP();
    }

    tampilkanDaftarHPP();
}


// ============================================
// FORMAT RUPIAH
// ============================================

function rupiah(angka) {

    if (
        angka === null ||
        angka === undefined ||
        !Number.isFinite(Number(angka))
    ) {
        return "-";
    }

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(angka);
}


// ============================================
// HITUNG
// ============================================

function hitung() {

    const potonganShopee =
        Number(
            document.getElementById(
                "potonganShopee"
            ).value
        ) / 100;

    const biayaProses =
        Number(
            document.getElementById(
                "biayaProses"
            ).value
        );

    const packingPerUnit =
        Number(
            document.getElementById(
                "packing"
            ).value
        );

    const riskReserve =
        Number(
            document.getElementById(
                "riskReserve"
            ).value
        ) / 100;

    const targetProfit =
        Number(
            document.getElementById(
                "targetProfit"
            ).value
        ) / 100;

    const efektivitasIklan =
        Number(
            document.getElementById(
                "efektivitasIklan"
            ).value
        ) / 100;

    const roasAcuan =
        Number(
            document.getElementById(
                "roasAcuan"
            ).value
        );

    const hargaEtalase =
        Number(
            document.getElementById(
                "hargaEtalase"
            ).value
        );

    const voucher =
        Number(
            document.getElementById(
                "voucher"
            ).value
        ) || 0;

    const hpp =
        Number(
            document.getElementById(
                "hpp"
            ).value
        );

    const roas =
        Number(
            document.getElementById(
                "roas"
            ).value
        );

    const hargaPasarElement =
        document.getElementById(
            "hargaPasar"
        );

    const hargaPasar =
        hargaPasarElement
            ? Number(hargaPasarElement.value)
            : 0;


    // ========================================
    // VALIDASI
    // ========================================

    if (hargaEtalase <= 0) {

        alert(
            "Masukkan Harga Etalase."
        );

        return;
    }

    if (!produkTerpilih || hpp <= 0) {

        alert(
            "Pilih produk terlebih dahulu."
        );

        return;
    }

    if (roas <= 0) {

        alert(
            "Masukkan ROAS Simulasi."
        );

        return;
    }

    if (roasAcuan <= 0) {

        alert(
            "ROAS Aktual Acuan harus lebih dari 0."
        );

        return;
    }

    if (efektivitasIklan <= 0) {

        alert(
            "Efektivitas Iklan harus lebih dari 0."
        );

        return;
    }


    // ========================================
    // PACKING
    // ========================================

    const unitPacking =
        Number(
            produkTerpilih.unitPacking
        ) || 1;

    const packing =
        packingPerUnit *
        unitPacking;


    // ========================================
    // HARGA EFEKTIF
    // ========================================

    const hargaEfektif =
        hargaEtalase -
        voucher;


    // ========================================
    // PROFIT SEBELUM IKLAN
    // ========================================

    const profitSebelumIklan =
        hargaEfektif
        - (
            hargaEfektif *
            potonganShopee
        )
        - biayaProses
        - hpp
        - packing
        - (
            hargaEfektif *
            riskReserve
        );


    // ========================================
    // BEP ROAS
    // ========================================

    let bepRoas = null;

    if (profitSebelumIklan > 0) {

        bepRoas =
            hargaEfektif /
            profitSebelumIklan;
    }


    // ========================================
    // TARGET PROFIT
    // ========================================

    const targetProfitRupiah =
        hargaEfektif *
        targetProfit;

    const sisaUntukIklan =
        profitSebelumIklan -
        targetProfitRupiah;

    let roasTargetProfit = null;

    if (sisaUntukIklan > 0) {

        roasTargetProfit =
            hargaEfektif /
            sisaUntukIklan;
    }


    // ========================================
    // ROAS TARGET APLIKASI
    // ========================================

    let roasTargetAplikasi = null;

    if (roasTargetProfit !== null) {

        roasTargetAplikasi =
            roasTargetProfit /
            efektivitasIklan;
    }


    // ========================================
    // PROFIT AKTUAL
    // ========================================

    const biayaIklan =
        hargaEfektif /
        roas;

    const profitAktual =
        profitSebelumIklan -
        biayaIklan;


    // ========================================
    // MARGIN
    // ========================================

    const marginAktual =
        hargaEfektif > 0
            ? profitAktual /
              hargaEfektif
            : 0;


    // ========================================
    // STATUS PROFIT
    // ========================================

    let statusProfit;

    if (profitAktual < 0) {

        statusProfit =
            "RUGI";

    } else if (
        profitAktual <
        targetProfitRupiah
    ) {

        statusProfit =
            "DI BAWAH TARGET";

    } else {

        statusProfit =
            "TARGET TERCAPAI";
    }


    // ========================================
    // HARGA TARGET
    // ========================================

    const penyebutHargaTarget =
        1
        - potonganShopee
        - riskReserve
        - (
            1 /
            roasAcuan
        )
        - targetProfit;

    let hargaTarget = null;
    let hargaTargetBulat = null;

    if (penyebutHargaTarget > 0) {

        hargaTarget =
            (
                hpp +
                packing +
                biayaProses
            ) /
            penyebutHargaTarget;

        hargaTargetBulat =
            Math.ceil(
                hargaTarget / 1000
            ) * 1000;
    }


    // ========================================
    // HARGA REKOMENDASI
    // ========================================

    const hargaRekomendasi =
        hargaTargetBulat;


    // ========================================
    // PERBANDINGAN HARGA PASAR
    // ========================================

    let selisihHarga = null;

    let statusHarga = "-";

    if (
        hargaPasar > 0 &&
        hargaRekomendasi !== null
    ) {

        selisihHarga =
            hargaRekomendasi -
            hargaPasar;

        if (selisihHarga < 0) {

            statusHarga =
                "LEBIH MURAH DARI PASAR";

        } else if (selisihHarga === 0) {

            statusHarga =
                "SAMA DENGAN PASAR";

        } else {

            statusHarga =
                "LEBIH MAHAL DARI PASAR";
        }
    }


    // ========================================
    // TAMPILKAN HASIL
    // ========================================

    document.getElementById(
        "hargaEfektif"
    ).textContent =
        rupiah(hargaEfektif);

    document.getElementById(
        "profitSebelumIklan"
    ).textContent =
        rupiah(profitSebelumIklan);

    document.getElementById(
        "bepRoas"
    ).textContent =
        bepRoas === null
            ? "TIDAK LAYAK"
            : bepRoas.toFixed(2);

    document.getElementById(
        "profitAktual"
    ).textContent =
        rupiah(profitAktual);

    document.getElementById(
        "roasTargetProfit"
    ).textContent =
        roasTargetProfit === null
            ? "TIDAK MEMENUHI"
            : roasTargetProfit.toFixed(2);

    document.getElementById(
        "roasTargetAplikasi"
    ).textContent =
        roasTargetAplikasi === null
            ? "TIDAK MEMENUHI"
            : roasTargetAplikasi.toFixed(2);

    document.getElementById(
        "marginAktual"
    ).textContent =
        (
            marginAktual * 100
        ).toFixed(2) + "%";

    document.getElementById(
        "statusProfit"
    ).textContent =
        statusProfit;


    // ========================================
    // HASIL HARGA
    // ========================================

    document.getElementById(
        "hargaTarget"
    ).textContent =
        hargaTarget === null
            ? "TIDAK LAYAK"
            : rupiah(hargaTarget);

    document.getElementById(
        "hargaTargetBulat"
    ).textContent =
        hargaTargetBulat === null
            ? "TIDAK LAYAK"
            : rupiah(hargaTargetBulat);

    document.getElementById(
        "hargaRekomendasi"
    ).textContent =
        hargaRekomendasi === null
            ? "TIDAK LAYAK"
            : rupiah(hargaRekomendasi);

    document.getElementById(
        "selisihHarga"
    ).textContent =
        selisihHarga === null
            ? "-"
            : rupiah(selisihHarga);

    document.getElementById(
        "statusHarga"
    ).textContent =
        statusHarga;


    // ========================================
    // SIMULASI ROAS
    // ========================================

    buatSimulasiROAS(
        hargaEfektif,
        profitSebelumIklan,
        targetProfitRupiah,
        bepRoas,
        roasTargetProfit
    );
}


// ============================================
// SIMULASI ROAS
// ============================================

function buatSimulasiROAS(
    hargaEfektif,
    profitSebelumIklan,
    targetProfitRupiah,
    bepRoas,
    roasTargetProfit
) {

    const container =
        document.getElementById(
            "simulasiRoas"
        );

    if (!container) return;

    container.innerHTML = "";


    // ========================================
    // RINGKASAN
    // ========================================

    const ringkasan =
        document.createElement("div");

    ringkasan.style.marginBottom = "15px";
    ringkasan.style.padding = "12px";
    ringkasan.style.border = "1px solid #ddd";
    ringkasan.style.borderRadius = "8px";

    ringkasan.innerHTML = `
        <div style="margin-bottom:8px;">
            <strong>BEP:</strong>
            ${
                bepRoas === null
                    ? "Tidak layak"
                    : "ROAS " +
                      bepRoas.toFixed(2)
            }
        </div>

        <div>
            <strong>Target Profit:</strong>
            ${
                roasTargetProfit === null
                    ? "Tidak memenuhi"
                    : "ROAS " +
                      roasTargetProfit.toFixed(2)
            }
        </div>
    `;

    container.appendChild(ringkasan);


    // ========================================
    // TABEL
    // ========================================

    const table =
        document.createElement("table");

    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    const header =
        document.createElement("tr");

    header.innerHTML = `
        <th style="
            padding:10px;
            border-bottom:1px solid #ddd;
            text-align:left;
        ">
            ROAS
        </th>

        <th style="
            padding:10px;
            border-bottom:1px solid #ddd;
            text-align:right;
        ">
            Biaya Iklan
        </th>

        <th style="
            padding:10px;
            border-bottom:1px solid #ddd;
            text-align:right;
        ">
            Profit
        </th>

        <th style="
            padding:10px;
            border-bottom:1px solid #ddd;
            text-align:right;
        ">
            Status
        </th>
    `;

    table.appendChild(header);


    // ========================================
    // ROAS 2 - 15
    // ========================================

    for (let roas = 2; roas <= 15; roas++) {

        const biayaIklan =
            hargaEfektif / roas;

        const profit =
            profitSebelumIklan -
            biayaIklan;

        let status;

        if (profit < 0) {

            status = "RUGI";

        } else if (
            profit < targetProfitRupiah
        ) {

            status =
                "DI BAWAH TARGET";

        } else {

            status =
                "TARGET TERCAPAI";
        }

        let penanda = "";

        if (
            bepRoas !== null &&
            roas >= bepRoas &&
            roas - 1 < bepRoas
        ) {

            penanda = " ← BEP";

        } else if (
            roasTargetProfit !== null &&
            roas >= roasTargetProfit &&
            roas - 1 < roasTargetProfit
        ) {

            penanda = " ← TARGET";
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td style="
                padding:10px;
                border-bottom:1px solid #eee;
            ">
                ${roas}${penanda}
            </td>

            <td style="
                padding:10px;
                border-bottom:1px solid #eee;
                text-align:right;
            ">
                ${rupiah(biayaIklan)}
            </td>

            <td style="
                padding:10px;
                border-bottom:1px solid #eee;
                text-align:right;
            ">
                ${rupiah(profit)}
            </td>

            <td style="
                padding:10px;
                border-bottom:1px solid #eee;
                text-align:right;
            ">
                ${status}
            </td>
        `;

        table.appendChild(row);
    }

    container.appendChild(table);
}


// ============================================
// EXPORT HPP
// ============================================

function exportHPP() {

    const dataBackup = [];

    produkData.forEach(function (produk) {

        const hppTersimpan =
            localStorage.getItem(
                "hpp_" + produk.sku
            );

        const hppAktif =
            hppTersimpan !== null
                ? Number(hppTersimpan)
                : Number(produk.hpp);

        dataBackup.push({
            sku: produk.sku,
            hppMaster: Number(produk.hpp),
            hppAktif: hppAktif
        });
    });

    const data = {
        nama: "Backup HPP Kalkulator Shopee",
        tanggal: new Date().toISOString(),
        jumlahProduk: dataBackup.length,
        produk: dataBackup
    };

    const isiFile =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [isiFile],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "backup_hpp_" +
        tanggalFile() +
        ".json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert(
        "Backup HPP berhasil dibuat.\n\n" +
        "Jumlah produk: " +
        dataBackup.length
    );
}


// ============================================
// TANGGAL FILE
// ============================================

function tanggalFile() {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    const jam =
        String(
            sekarang.getHours()
        ).padStart(2, "0");

    const menit =
        String(
            sekarang.getMinutes()
        ).padStart(2, "0");

    const detik =
        String(
            sekarang.getSeconds()
        ).padStart(2, "0");

    return (
        tahun +
        bulan +
        tanggal +
        "_" +
        jam +
        menit +
        detik
    );
}


// ============================================
// IMPORT HPP
// ============================================

function importHPP() {

    const input =
        document.getElementById(
            "fileImportHPP"
        );

    if (!input) {

        alert(
            "Input file IMPORT HPP tidak ditemukan."
        );

        return;
    }

    input.value = "";

    input.click();
}


// ============================================
// PROSES IMPORT HPP
// ============================================

function prosesImportHPP(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function (e) {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );

                if (
                    !data ||
                    !Array.isArray(data.produk)
                ) {

                    throw new Error(
                        "Format file backup tidak valid."
                    );
                }

                const konfirmasi =
                    confirm(
                        "IMPORT HPP akan mengganti HPP Aktif yang tersimpan di browser.\n\n" +
                        "Jumlah data backup: " +
                        data.produk.length +
                        "\n\n" +
                        "Lanjutkan?"
                    );

                if (!konfirmasi) return;

                let berhasil = 0;
                let dilewati = 0;

                data.produk.forEach(
                    function (item) {

                        if (
                            !item.sku ||
                            !Number.isFinite(
                                Number(item.hppAktif)
                            ) ||
                            Number(item.hppAktif) <= 0
                        ) {

                            dilewati++;

                            return;
                        }

                        const produk =
                            produkData.find(
                                function (p) {
                                    return (
                                        p.sku ===
                                        item.sku
                                    );
                                }
                            );

                        if (!produk) {

                            dilewati++;

                            return;
                        }

                        localStorage.setItem(
                            "hpp_" + item.sku,
                            Number(item.hppAktif)
                        );

                        berhasil++;
                    }
                );


                // REFRESH PRODUK YANG SEDANG DIPILIH

                if (produkTerpilih) {

                    const hppTersimpan =
                        localStorage.getItem(
                            "hpp_" +
                            produkTerpilih.sku
                        );

                    document.getElementById(
                        "hpp"
                    ).value =
                        hppTersimpan !== null
                            ? Number(hppTersimpan)
                            : Number(
                                produkTerpilih.hpp
                            );

                    updateIndikatorHPP();
                }


                // REFRESH DAFTAR

                const panel =
                    document.getElementById(
                        "kelolaHPP"
                    );

                if (
                    panel &&
                    panel.style.display !== "none"
                ) {

                    tampilkanDaftarHPP();
                }


                alert(
                    "IMPORT HPP selesai.\n\n" +
                    "Berhasil: " +
                    berhasil +
                    " produk\n" +
                    "Dilewati: " +
                    dilewati +
                    " data"
                );

            } catch (error) {

                alert(
                    "Gagal membaca file backup HPP.\n\n" +
                    error.message
                );
            }
        };

    reader.onerror =
        function () {

            alert(
                "File tidak dapat dibaca."
            );
        };

    reader.readAsText(file);
}