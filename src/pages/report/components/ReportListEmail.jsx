import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react"
import axios from "axios"
import BasicTable from "../../../components/table/BasicTable"
import { Button } from "react-bootstrap"
import config from "../../../config"
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai"
import { SiMinutemailer } from "react-icons/si"
import { FiRefreshCw } from "react-icons/fi"
import { BiMailSend } from "react-icons/bi";


const ReportListEmail = forwardRef((props, ref) => {
    const apiUrl = config.apiUrl + "/report"

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Project",
                accessor: "projectTitle",
            },
            {
                Header: "Company",
                accessor: "companyName",
            },

            {
                Header: "Report From",
                "accessor": "personFullName"
            },
            {
                Header: "Report Date",
                accessor: "reportDate",
                Cell: ({ value }) => {
                    const date = new Date(value);
                    const formatted = new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    }).format(date);
                    return formatted;
                }
            },
            {
                Header: "Send Report Status",
                accessor: "emailStatus",
                Cell: ({ value }) => {
                    const getStatusStyle = (status) => {
                        let backgroundColor = "#6c757d"; // default gray

                        switch (status) {
                            case "PENDING":
                                backgroundColor = "#ffc107"; // yellow
                                break;
                            case "SUCCESS":
                                backgroundColor = "#198754"; // green
                                break;
                            case "FAILED":
                                backgroundColor = "#dc3545"; // red
                                break;
                            default:
                                backgroundColor = "#6c757d"; // gray
                        }

                        return {
                            padding: "4px 10px",
                            borderRadius: "999px",
                            color: "white",
                            display: "inline-block",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            backgroundColor,
                        };
                    };

                    return <span style={getStatusStyle(value)}>{value}</span>;
                },
            },
            {
                Header: "Action",
                accessor: "",
                Cell: ({ row }) => {
                    const { emailStatus } = row.values;
                    const isEmailSuccess = emailStatus === "SUCCESS";

                    return (
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            <AiOutlineEye
                                onClick={() => props.onDetail(row.values)}
                                style={{
                                    color: "#0d6efd", // biru
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                }}
                                title="View Detail"
                            />
                            {isEmailSuccess ? (
                                <FiRefreshCw
                                    onClick={() => props.onResend(row.values)}
                                    style={{
                                        color: "#17a2b8",
                                        fontSize: "1.2rem",
                                        cursor: "pointer",
                                    }}
                                    title="Resend Email"
                                />
                            ) : (
                                <BiMailSend
                                    onClick={() => props.onSend(row.values)}
                                    style={{
                                        color: "#dc3545",
                                        fontSize: "1.5rem",
                                        cursor: "pointer",
                                    }}
                                    title="Send Email"
                                />
                            )}

                        </div>
                    );
                },
            }
        ],
        [props]
    )
    const [totalPage, setTotalPage] = useState(0)
    const [totalData, setTotalData] = useState(0)

    const filters = useRef({})

    const currentPageIndex = useRef({})
    const currentPageSize = useRef(10)
    const currentSortBy = useRef({})

    useImperativeHandle(ref, () => ({
        refreshData() {
            const defaultValues = {
                pageSize: currentPageSize.current,
                pageIndex: 0,
                sortBy: [],
            }

            fetchData({ ...defaultValues })
        },

        reloadData() {
            const values = {
                pageIndex: currentPageIndex.current,
                pageSize: currentPageSize.current,
                sortBy: currentSortBy.current,
            }
            fetchData({ ...values })
        },

        doFilter(data) {
            filters.current = data
            this.refreshData()
        },
    }))


    const fetchData = useCallback(
        async ({ pageSize, pageIndex, sortBy }) => {
            setLoading(true)
            try {
                const params = {
                    page: pageIndex + 1,
                    ...filters.current,
                }

                if (sortBy && sortBy.length) {
                    params.orderBy = sortBy[0].id
                    params.sortBy = sortBy[0].desc ? "desc" : "asc"
                }

                if (pageSize) params.record = pageSize

                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];


                const { data } = await axios.get(apiUrl, {
                    params,
                    headers: {
                        Authorization: token
                    }
                });

                const lists = data.data.reports
                const pagination = data.data.paging

                setData(lists)
                setTotalPage(pagination.total_page)
                setTotalData(pagination.total_item)
                currentPageIndex.current = pageIndex
                currentPageIndex.pageSize = pageSize
                currentPageIndex.sortBy = sortBy

                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        },
        [apiUrl]
    )

    return (
        <BasicTable
            columns={columns}
            data={data}
            fetchData={fetchData}
            loading={loading}
            totalPage={totalPage}
            totalData={totalData}
        />
    )
})

ReportListEmail.defaultProps = {

    onSend: (data) => { },
    onResend: (data) => { },
    onDetail: (data) => { },

}

export default ReportListEmail