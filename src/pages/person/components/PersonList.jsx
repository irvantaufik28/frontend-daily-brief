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
import { AiOutlineEye } from "react-icons/ai"

const PersonList = forwardRef((props, ref) => {
  const apiUrl = config.apiUrl + "/person"

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "fullName",
      },
      {
        Header: "Role",
        accessor: "user.role",
      },
      {
        Header: "Position",
        accessor: "position",
      },
      {
        Header: "Email",
        "accessor": "email"
      },
      {
        Header: "Engagements",
        "accessor": "category"
      },
      {
        Header: "Join Date",
        accessor: "startDate",
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
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const isActive = value === "ACTIVE";

          const statusStyle = {
            padding: "4px 10px",
            borderRadius: "999px",
            color: "white",
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "0.75rem",
            textTransform: isActive ? "uppercase" : "lowercase",
            backgroundColor: isActive ? "#11e602" : "red",
          };

          return <span style={statusStyle}>{value}</span>;
        },
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <>
            <div style={{
              // display: "flex", justifyContent: "center" 
            }}>
              <AiOutlineEye
                onClick={() => props.onDetail(row.values)}
                style={{
                  color: "black",
                  fontSize: "1.2rem",
                  cursor: "pointer"
                }}
                title="View Detail"
              />
            </div>
            {/* <Button
              variant="info"
              size="sm"
              className="me-2"
              onClick={() => props.onEdit(row.values)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => props.onDelete(row.values)}
            >
              Delete
            </Button> */}
          </>
        ),
        // headerClassName: "text-center",
      },
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

        const lists = data.data.persons
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

PersonList.defaultProps = {
  onDetail: (data) => { },
  onEdit: (data) => { },
  onDelete: (data) => { },
}

export default PersonList