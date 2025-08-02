import { useState, useEffect, useMemo, useCallback, useRef, useImperativeHandle } from "react";
import axios from "axios";
import BasicTable from "../../../components/table/BasicTable";
import config from "../../../config";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
const ListMembers = ({ ref, projectId, onSuccessAssign }) => {
  const apiUrl = config.apiUrl + "/person-not-in/project";
  const assignUrl = config.apiUrl + "/project/member-assign";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPersonIds, setSelectedPersonIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const columns = useMemo(() => [
    {
      Header: "",
      accessor: "checkbox",
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedPersonIds.includes(row.original.id)}
          onChange={() => togglePersonSelection(row.original.id)}
        />
      ),
      disableSortBy: true,
    },
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
      Header: "Join Date",
      accessor: "startDate",
      Cell: ({ value }) => {
        const date = new Date(value);
        return new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date);
      },
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

  ], [selectedPersonIds]);

  const togglePersonSelection = (id) => {
    setSelectedPersonIds(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

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

  const fetchData = useCallback(async ({ pageSize, pageIndex, sortBy }) => {
    setLoading(true);
    try {
      const params = {
        page: pageIndex + 1,
        record: pageSize,
        projectId : projectId,
      };

      if (sortBy && sortBy.length) {
        params.orderBy = sortBy[0].id;
        params.sortBy = sortBy[0].desc ? "desc" : "asc";
      }
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleAssign = async () => {
    if (!selectedPersonIds.length) {
      Swal.fire("Warning", "Please select at least one person.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Assignment",
      text: "Are you sure you want to assign the selected members to this project?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      await axios.post(assignUrl, {
        personIds: selectedPersonIds,
        projectId,
      }, {
        headers: {
          Authorization: token,
        },
      });

      await Swal.fire("Success", "Members assigned successfully!", "success");
      setSelectedPersonIds([]);
      onSuccessAssign?.();
    } catch (error) {
      console.error("Assign failed", error);
      Swal.fire("Error", "Failed to assign members.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="success"
          disabled={submitting || selectedPersonIds.length === 0}
          onClick={handleAssign}
        >
          {submitting ? "Assigning..." : "Add Member"}
        </Button>
      </div>

      <BasicTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        totalPage={totalPage}
        totalData={totalData}
      />
    </>
  );
};

export default ListMembers;
