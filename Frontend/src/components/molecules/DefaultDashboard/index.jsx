import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Layout from '../../../layout';
import { CardOne, CardTwo, CardThree, CardFour, ChartOne, ChartTwo, Breadcrumb } from '../../../components';
import axios from "axios";

const DefaultDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [dataPegawai, setDataPegawai] = useState(null);

    useEffect(() => {
        const getDataPegawai = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/data_pegawai/name/${user.nama_pegawai}`
                );
                const data = response.data;
                setDataPegawai(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (user && user.hak_akses === "pegawai") {
            getDataPegawai();
        }
    }, [user]);


    return (
        <Layout>
            <Breadcrumb pageName='Dashboard' />
            {user && user.hak_akses === "admin" && (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
                    <CardOne />
                    <CardTwo />
                    <CardThree />
                    <CardFour />
                </div>
            )}
            {user && user.hak_akses === "admin" && (
                <div className="mt-4 grid grid-cols-12 gap-6 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12 sm:col-span-7">
                        <ChartOne />
                    </div>
                    <div className="col-span-12 sm:col-span-5">
                        <ChartTwo />
                    </div>
                </div>
            )}
            
        </Layout>
    );
};

export default DefaultDashboard;
