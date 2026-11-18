
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TestServicePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");




  const handleCreateService = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            title: "Laptop Repair Service",
            category: "Laptop & PC",
            description:
              "Professional laptop repair and troubleshooting service.",
            image: "https://placehold.co/600x400",
            basePrice: 2000,
            estimatedDuration: "2 Hours",
            serviceMode: "Shop Drop-off",
            serviceArea: "Sylhet",
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setResult(responseData.message || "Service creation failed!");
        return;
      }

      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleGetMyServices = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/my-services",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setResult(responseData.message || "Failed to fetch services!");
        return;
      }

      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  const handleUpdateService = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/6afca88c834e362fc6d286fc",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            title: "iPhone Screen Replacement - Updated",
            category: "Smartphone",
            description:
              "Professional iPhone screen replacement with quality parts.",
            image: "https://placehold.co/600x400",
            basePrice: 1800,
            estimatedDuration: "1.5 Hours",
            serviceMode: "Shop Drop-off",
            serviceArea: "Sylhet",
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setResult(responseData.message || "Service update failed!");
        return;
      }

      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteService = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/6afca88c834e362fc6d286fc",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setResult(responseData.message || "Service deletion failed!");
        return;
      }

      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  const handleTestAdminAccess = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/admin/pending",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const responseData = await response.json();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            response: responseData,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleApproveService = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/admin/6afd1001f83d0707717cf087/approval",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            approvalStatus: "approved",
          }),
        }
      );

      const responseData = await response.json();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            response: responseData,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleRejectService = async () => {
    setLoading(true);
    setResult("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/services/admin/6afd1309f83d0707717cf088/approval",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            approvalStatus: "rejected",
          }),
        }
      );

      const responseData = await response.json();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            response: responseData,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



const handleToggleAvailability = async () => {
  setLoading(true);
  setResult("");

  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      setResult(error?.message || "Unable to get JWT token!");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/services/6afd1309f83d0707717cf088/availability",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
       body: JSON.stringify({
  isAvailable: true,
}),
      }
    );

    const responseData = await response.json();

    setResult(
      JSON.stringify(
        {
          status: response.status,
          response: responseData,
        },
        null,
        2
      )
    );
  } catch (error) {
    setResult("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-6">
      <h1 className="text-2xl font-bold">
        FixMate - Test Service API
      </h1>

      <button
        onClick={handleCreateService}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Test Service"}
      </button>

      <button
        onClick={handleGetMyServices}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Loading..." : "Get My Services"}
      </button>


      <button
        onClick={handleUpdateService}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Test Service"}
      </button>


      <button
        onClick={handleDeleteService}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete Test Service"}
      </button>

      <button
        onClick={handleTestAdminAccess}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        Test Admin Access
      </button>

      <button
        onClick={handleApproveService}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Approving..." : "Approve Test Service"}
      </button>


      <button onClick={handleRejectService}>
        Reject Service
      </button>


<button onClick={handleToggleAvailability} disabled={loading}>
  Disable Service
</button>

      {result && (
        <pre className="w-full max-w-xl overflow-auto rounded-lg bg-gray-100 p-4 text-sm text-black">
          {result}
        </pre>
      )}
    </div>
  );
}


