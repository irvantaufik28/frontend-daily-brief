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
import { MdOutlinePersonOff } from "react-icons/md";

const ProjectMemberList = forwardRef((props, ref) => {
  const apiUrl = config.apiUrl + "/project-member"
  const [hasFilter, setHasFilter] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
        accessor: "position"
      },
      {
        Header: "Assigned At",
        accessor: 'assignedAt'
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <>
            <div style={{
              // display: "flex", justifyContent: "center" 
            }}>
              <MdOutlinePersonOff

                 onClick={() => props.onUnassign(row.original)}
                style={{
                  color: "red",
                  fontSize: "1.2rem",
                  cursor: "pointer"
                }}
                title="View Detail"
              />
            </div>
            
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
      setHasFilter(true) // ← hanya mulai fetch setelah user klik search
      setIsInitialLoad(false)
      props.setIsInitialLoad(false);
      this.refreshData()
    },

    resetState() {
      filters.current = {};
      setHasFilter(false);
      props.setIsInitialLoad(true)
      setIsInitialLoad(true); // ⬅️ trigger empty message
      setData([]);
    },
  }))


  const fetchData = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      if (!hasFilter) return;
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

        const lists = data.data.members
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
    [apiUrl, hasFilter]
  )

  return (
    <>
      {isInitialLoad ? (
        <div className="text-center py-4 text-muted">
          Please select a <strong>Company</strong> and <strong>Project</strong> to begin.
        </div>
      ) : (
        <BasicTable
          columns={columns}
          data={data}
          fetchData={fetchData}
          loading={loading}
          totalPage={totalPage}
          totalData={totalData}
        />
      )}
    </>
  )
})

ProjectMemberList.defaultProps = {
  onUnassign: (data) => { },
}

export default ProjectMemberList