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

const ProjectList = forwardRef((props, ref) => {
  const apiUrl = config.apiUrl + "/project"

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Start Project",
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
          const statusColors = {
            ONGOING: "#28a745",     // Green
            COMPLETED: "#007bff",   // Blue
            CANCELLED: "#dc3545",   // Red
            PAUSED: "#ffc107",      // Yellow/Amber
          };

          const backgroundColor = statusColors[value] || "#6c757d"; // Default: gray

          const statusStyle = {
            padding: "4px 10px",
            borderRadius: "999px",
            color: "white",
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            backgroundColor,
          };

          return <span style={statusStyle}>{value}</span>;
        },
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <AiOutlineEye
              onClick={() => props.onDetail(row.values)}
              style={{
                color: "#0d6efd", // bootstrap primary
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
              title="View Detail"
            />
            <AiOutlineEdit
              onClick={() => props.onEdit(row.values)}
              style={{
                color: "#0dcaf0", // bootstrap info
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
              title="Edit"
            />
            <AiOutlineDelete
              onClick={() => props.onDelete(row.values)}
              style={{
                color: "#dc3545", // bootstrap danger
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
              title="Delete"
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

        const lists = data.data.projects
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

ProjectList.defaultProps = {
  onDetail: (data) => { },
  onEdit: (data) => { },
  onDelete: (data) => { },
}

export default ProjectList