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
        Header: "Position",
        accessor: "position",
      },
      {
        Header: "Email",
        "accessor" : "email"
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="me-2"
              onClick={() => props.onDetail(row.values)}
            >
              Detail
            </Button>
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

        const lists = data.data.data
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