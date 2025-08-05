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

const ReportDraftList = forwardRef((props, ref) => {
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
                Header: "Action",
                accessor: "",
                Cell: ({ row }) => (
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>

                        <AiOutlineEdit
                            onClick={() => props.onEdit(row.values)}
                            style={{
                                color: "#0dcaf0", // bootstrap info
                                fontSize: "1.2rem",
                                cursor: "pointer",
                            }}
                            title="Edit"
                        />

                    </div>
                ),
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
                    isDraft: true,
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

ReportDraftList.defaultProps = {
    onEdit: (data) => { },
    onDelete: (data) => { },
}

export default ReportDraftList