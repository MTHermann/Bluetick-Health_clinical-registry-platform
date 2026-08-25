# Bluetick Health EMR

Scalable clinical registry, data collection, validation and analytics platform.

This repository currently contains an initial scaffold. Replace the example stack and files below with the real project code.

"use client";

import { useState } from "react";

type Section =
  | "dashboard"
  | "organisation"
  | "users"
  | "patients"
  | "forms"
  | "validation"
  | "analytics";

type AdminTab =
  | "countries"
  | "hospitals"
  | "departments"
  | "icus";

type Country = {
  id: string;
  name: string;
  code: string;
};

type Hospital = {
  id: string;
  name: string;
  countryId: string;
  latitude?: number;
  longitude?: number;
};

type Department = {
  id: string;
  name: string;
  hospitalId: string;
};

type ICU = {
  id: string;
  name: string;
  departmentId: string;
};

export default function ClinicalRegistry() {
  const [section, setSection] = useState<Section>("dashboard");

  /*
   * IMPORTANT:
   *
   * These arrays are intentionally EMPTY.
   *
   * In the next stage they will be replaced with PostgreSQL data.
   *
   * The administrator will create countries, hospitals,
   * departments and ICU units from the interface.
   */

  const [countries, setCountries] = useState<Country[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [icus, setIcus] = useState<ICU[]>([]);

  const [adminTab, setAdminTab] =
    useState<AdminTab>("countries");

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app">

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background: #f4f7fa;
          color: #17232d;
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .sidebar {
          width: 250px;
          min-height: 100vh;

          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;

          background: #103b5c;
          color: white;

          padding: 25px 15px;
        }

        .logo {
          padding: 0 12px 25px;

          border-bottom:
            1px solid
            rgba(255,255,255,.15);

          font-size: 20px;
          font-weight: 700;
        }

        .logo small {
          display: block;

          margin-top: 6px;

          font-size: 11px;
          font-weight: 400;

          opacity: .65;
        }

        .nav {
          margin-top: 20px;
        }

        .nav-title {
          padding: 18px 12px 8px;

          font-size: 10px;
          text-transform: uppercase;

          letter-spacing: 1px;

          opacity: .5;
        }

        .nav button {
          width: 100%;

          border: none;

          background: transparent;

          color: #dbe8ef;

          text-align: left;

          padding: 12px;

          border-radius: 7px;

          margin-bottom: 3px;
        }

        .nav button:hover,
        .nav button.active {
          background: #1c587f;
          color: white;
        }

        .main {
          margin-left: 250px;

          min-height: 100vh;

          width:
            calc(100% - 250px);
        }

        .topbar {
          height: 70px;

          background: white;

          border-bottom:
            1px solid
            #e1e6ea;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          padding: 0 30px;

          position: sticky;
          top: 0;

          z-index: 10;
        }

        .page {
          padding: 30px;

          max-width: 1500px;

          margin: auto;
        }

        h1 {
          margin: 0;

          font-size: 28px;
        }

        .subtitle {
          color: #687681;

          margin-top: 7px;

          margin-bottom: 25px;
        }

        .metrics {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 18px;

          margin-bottom: 25px;
        }

        .metric {
          background: white;

          border:
            1px solid
            #e0e6eb;

          border-radius: 10px;

          padding: 22px;
        }

        .metric-label {
          color: #6d7982;

          font-size: 13px;
        }

        .metric-value {
          font-size: 30px;

          font-weight: 700;

          margin-top: 8px;
        }

        .card {
          background: white;

          border:
            1px solid
            #e0e6eb;

          border-radius: 10px;

          padding: 24px;

          margin-bottom: 20px;
        }

        .card-title {
          font-size: 17px;

          font-weight: 700;

          margin-bottom: 18px;
        }

        .admin-tabs {
          display: flex;

          gap: 8px;

          margin-bottom: 20px;

          flex-wrap: wrap;
        }

        .tab {
          border:
            1px solid
            #ccd6de;

          background: white;

          padding: 10px 15px;

          border-radius: 6px;
        }

        .tab.active {
          background: #123f60;

          color: white;

          border-color:
            #123f60;
        }

        .button {
          border: none;

          background: #123f60;

          color: white;

          padding: 10px 16px;

          border-radius: 6px;

          font-weight: 600;
        }

        .button.secondary {
          background: white;

          color: #123f60;

          border:
            1px solid
            #ccd6de;
        }

        .button.danger {
          background: #a93636;
        }

        .actions {
          display: flex;

          gap: 8px;

          flex-wrap: wrap;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;

          border-collapse:
            collapse;
        }

        th {
          background: #f7f9fa;

          color: #66727c;

          font-size: 11px;

          text-align: left;

          text-transform:
            uppercase;

          letter-spacing:
            .4px;
        }

        th,
        td {
          padding: 13px;

          border-bottom:
            1px solid
            #edf0f2;
        }

        td {
          font-size: 14px;
        }

        .empty {
          padding: 50px 20px;

          text-align: center;

          color: #78838c;
        }

        .empty strong {
          display: block;

          color: #394852;

          font-size: 16px;

          margin-bottom: 7px;
        }

        .form {
          display: grid;

          gap: 15px;

          max-width: 600px;
        }

        .form-group {
          display: grid;

          gap: 7px;
        }

        .form-group label {
          font-size: 13px;

          font-weight: 700;
        }

        input,
        select {
          padding: 11px;

          border:
            1px solid
            #ccd6de;

          border-radius: 6px;

          background: white;
        }

        .modal-overlay {
          position: fixed;

          inset: 0;

          background:
            rgba(0,0,0,.45);

          display: grid;

          place-items: center;

          z-index: 100;
        }

        .modal {
          width: min(600px, 90vw);

          background: white;

          border-radius: 10px;

          padding: 25px;

          max-height: 90vh;

          overflow-y: auto;
        }

        .modal-header {
          display: flex;

          justify-content:
            space-between;

          align-items: center;

          margin-bottom: 20px;
        }

        .close {
          border: none;

          background: transparent;

          font-size: 24px;
        }

        .geo-instructions {
          background: #e8f4f8;

          border: 1px solid #87c8e0;

          border-radius: 6px;

          padding: 12px;

          margin-bottom: 15px;

          font-size: 13px;

          color: #1a5f7f;

          line-height: 1.5;
        }

        .geo-inputs {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 10px;
        }

        .location-badge {
          background: #e8f4f8;

          border: 1px solid #87c8e0;

          border-radius: 4px;

          padding: 6px 8px;

          font-size: 11px;

          color: #1a5f7f;

          word-break: break-all;

          font-family: 'Courier New', monospace;

          line-height: 1.4;
        }

        .map-container {
          background: #f0f0f0;

          border: 1px solid #ddd;

          border-radius: 6px;

          height: 300px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 14px;

          color: #666;

          margin: 15px 0;
        }

        @media(max-width: 900px) {

          .metrics {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media(max-width: 700px) {

          .sidebar {
            display: none;
          }

          .main {
            margin-left: 0;

            width: 100%;
          }

          .page {
            padding: 20px 15px;
          }

          .metrics {
            grid-template-columns: 1fr;
          }

          .geo-inputs {
            grid-template-columns: 1fr;
          }

        }

      `}</style>


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          Clinical Registry

          <small>
            Data & Analytics Platform
          </small>

        </div>


        <div className="nav">

          <div className="nav-title">
            Registry
          </div>

          <NavButton
            active={
              section === "dashboard"
            }
            onClick={() =>
              setSection("dashboard")
            }
          >
            Dashboard
          </NavButton>


          <NavButton
            active={
              section === "patients"
            }
            onClick={() =>
              setSection("patients")
            }
          >
            Patients
          </NavButton>


          <NavButton
            active={
              section === "forms"
            }
            onClick={() =>
              setSection("forms")
            }
          >
            Data Collection
          </NavButton>


          <NavButton
            active={
              section === "validation"
            }
            onClick={() =>
              setSection("validation")
            }
          >
            Validation
          </NavButton>


          <NavButton
            active={
              section === "analytics"
            }
            onClick={() =>
              setSection("analytics")
            }
          >
            Analytics
          </NavButton>


          <div className="nav-title">
            Administration
          </div>


          <NavButton
            active={
              section === "organisation"
            }
            onClick={() =>
              setSection("organisation")
            }
          >
            Organisation
          </NavButton>


          <NavButton
            active={
              section === "users"
            }
            onClick={() =>
              setSection("users")
            }
          >
            Users & Permissions
          </NavButton>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        <header className="topbar">

          <strong>
            Clinical Registry
          </strong>

          <div>
            Administrator
          </div>

        </header>


        <div className="page">

          {section === "dashboard" && (
            <Dashboard
              countries={countries.length}
              hospitals={hospitals.length}
              departments={
                departments.length
              }
              icus={icus.length}
            />
          )}


          {section ===
            "organisation" && (

            <OrganisationAdmin
              countries={countries}
              hospitals={hospitals}
              departments={
                departments
              }
              icus={icus}

              setCountries={
                setCountries
              }

              setHospitals={
                setHospitals
              }

              setDepartments={
                setDepartments
              }

              setIcus={
                setIcus
              }

              adminTab={
                adminTab
              }

              setAdminTab={
                setAdminTab
              }

              showForm={
                showForm
              }

              setShowForm={
                setShowForm
              }
            />

          )}


          {section === "users" && (
            <Users />
          )}


          {section === "patients" && (
            <Patients />
          )}


          {section === "forms" && (
            <DataCollection />
          )}


          {section ===
            "validation" && (
            <Validation />
          )}


          {section ===
            "analytics" && (
            <Analytics
              hospitals={hospitals}
            />
          )}

        </div>

      </main>

    </div>
  );
}


/* NAVIGATION */

function NavButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;

  active: boolean;

  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "active"
          : ""
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}


/* DASHBOARD */

function Dashboard({
  countries,
  hospitals,
  departments,
  icus,
}: {
  countries: number;
  hospitals: number;
  departments: number;
  icus: number;
}) {
  return (
    <>
      <h1>
        Registry Dashboard
      </h1>

      <p className="subtitle">
        Overview of the registry.
      </p>


      <div className="metrics">

        <Metric
          title="Countries"
          value={countries}
        />

        <Metric
          title="Hospitals"
          value={hospitals}
        />

        <Metric
          title="Departments"
          value={departments}
        />

        <Metric
          title="ICU Units"
          value={icus}
        />

      </div>


      <div className="card">

        <div className="card-title">
          Registry Status
        </div>

        {countries === 0 ? (

          <div className="empty">

            <strong>
              No sites have been
              configured yet
            </strong>

            The administrator can
            begin by adding the first
            country under
            Organisation.

          </div>

        ) : (

          <div>

            The registry currently
            contains {countries}{" "}
            countries, {hospitals}{" "}
            hospitals, {departments}{" "}
            departments and{" "}
            {icus} ICU units.

          </div>

        )}

      </div>
    </>
  );
}


function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="metric">

      <div className="metric-label">
        {title}
      </div>

      <div className="metric-value">
        {value}
      </div>

    </div>
  );
}


/* ORGANISATION ADMINISTRATION */

function OrganisationAdmin({
  countries,
  hospitals,
  departments,
  icus,

  setCountries,
  setHospitals,
  setDepartments,
  setIcus,

  adminTab,
  setAdminTab,

  showForm,
  setShowForm,
}: {
  countries: Country[];
  hospitals: Hospital[];
  departments: Department[];
  icus: ICU[];

  setCountries:
    React.Dispatch<
      React.SetStateAction<Country[]>
    >;

  setHospitals:
    React.Dispatch<
      React.SetStateAction<Hospital[]>
    >;

  setDepartments:
    React.Dispatch<
      React.SetStateAction<Department[]>
    >;

  setIcus:
    React.Dispatch<
      React.SetStateAction<ICU[]>
    >;

  adminTab: AdminTab;

  setAdminTab:
    React.Dispatch<
      React.SetStateAction<AdminTab>
    >;

  showForm: boolean;

  setShowForm:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
}) {

  function addCountry(
    name: string,
    code: string
  ) {

    setCountries((current) => [

      ...current,

      {
        id:
          crypto.randomUUID(),

        name,

        code,
      },

    ]);

    setShowForm(false);
  }


  function addHospital(
    name: string,
    countryId: string,
    latitude?: number,
    longitude?: number
  ) {

    setHospitals((current) => [

      ...current,

      {
        id:
          crypto.randomUUID(),

        name,

        countryId,

        latitude,

        longitude,
      },

    ]);

    setShowForm(false);
  }


  function addDepartment(
    name: string,
    hospitalId: string
  ) {

    setDepartments(
      (current) => [

        ...current,

        {
          id:
            crypto.randomUUID(),

          name,

          hospitalId,
        },

      ]
    );

    setShowForm(false);
  }


  function addICU(
    name: string,
    departmentId: string
  ) {

    setIcus((current) => [

      ...current,

      {
        id:
          crypto.randomUUID(),

        name,

        departmentId,
      },

    ]);

    setShowForm(false);
  }


  const labels: Record<
    AdminTab,
    string
  > = {

    countries:
      "Countries",

    hospitals:
      "Hospitals",

    departments:
      "Departments",

    icus:
      "ICU Units",

  };


  return (
    <>
      <h1>
        Organisation
      </h1>

      <p className="subtitle">
        Create and manage the
        registry's organisational
        structure.
      </p>


      <div className="admin-tabs">

        {(
          Object.keys(labels) as
          AdminTab[]
        ).map((tab) => (

          <button
            key={tab}

            className={
              adminTab === tab
                ? "tab active"
                : "tab"
            }

            onClick={() =>
              setAdminTab(tab)
            }
          >
            {labels[tab]}
          </button>

        ))}

      </div>


      <div className="card">

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "20px",

            gap: "15px",

            flexWrap: "wrap",
          }}
        >

          <div className="card-title">
            {labels[adminTab]}
          </div>

          <button
            className="button"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Add{" "}
            {adminTab === "icus"
              ? "ICU"
              : adminTab.slice(
                  0,
                  -1
                )}
          </button>

        </div>


        {adminTab ===
          "countries" && (

          <CountryTable
            countries={
              countries
            }
          />

        )}


        {adminTab ===
          "hospitals" && (

          <HospitalTable
            hospitals={
              hospitals
            }

            countries={
              countries
            }
          />

        )}


        {adminTab ===
          "departments" && (

          <DepartmentTable
            departments={
              departments
            }

            hospitals={
              hospitals
            }
          />

        )}


        {adminTab === "icus" && (

          <ICUTable
            icus={icus}

            departments={
              departments
            }
          />

        )}

      </div>


      {showForm && (

        <OrganisationForm
          type={adminTab}

          countries={
            countries
          }

          hospitals={
            hospitals
          }

          departments={
            departments
          }

          onClose={() =>
            setShowForm(false)
          }

          onCountry={
            addCountry
          }

          onHospital={
            addHospital
          }

          onDepartment={
            addDepartment
          }

          onICU={addICU}

        />

      )}

    </>
  );
}


/* ORGANISATION FORM */

function OrganisationForm({
  type,
  countries,
  hospitals,
  departments,

  onClose,
  onCountry,
  onHospital,
  onDepartment,
  onICU,
}: {
  type: AdminTab;

  countries: Country[];
  hospitals: Hospital[];
  departments: Department[];

  onClose: () => void;

  onCountry: (
    name: string,
    code: string
  ) => void;

  onHospital: (
    name: string,
    countryId: string,
    latitude?: number,
    longitude?: number
  ) => void;

  onDepartment: (
    name: string,
    hospitalId: string
  ) => void;

  onICU: (
    name: string,
    departmentId: string
  ) => void;
}) {

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [
    countryId,
    setCountryId,
  ] = useState("");

  const [
    hospitalId,
    setHospitalId,
  ] = useState("");

  const [
    departmentId,
    setDepartmentId,
  ] = useState("");

  const [
    latitude,
    setLatitude,
  ] = useState<number | "">(
    ""
  );

  const [
    longitude,
    setLongitude,
  ] = useState<number | "">(
    ""
  );

  const [
    googleMapsUrl,
    setGoogleMapsUrl,
  ] = useState("");


  function submit(
    event: React.FormEvent
  ) {

    event.preventDefault();


    if (!name.trim()) {
      return;
    }


    if (type ===
      "countries") {

      onCountry(
        name,
        code
      );

      return;
    }


    if (type ===
      "hospitals") {

      if (!countryId) {
        return;
      }

      onHospital(
        name,
        countryId,
        latitude !== ""
          ? latitude
          : undefined,
        longitude !== ""
          ? longitude
          : undefined
      );

      return;
    }


    if (type ===
      "departments") {

      if (!hospitalId) {
        return;
      }

      onDepartment(
        name,
        hospitalId
      );

      return;
    }


    if (type === "icus") {

      if (!departmentId) {
        return;
      }

      onICU(
        name,
        departmentId
      );

    }

  }


  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>
            Add{" "}
            {type === "countries"
              ? "Country"
              : type === "hospitals"
              ? "Hospital"
              : type === "departments"
              ? "Department"
              : "ICU Unit"}
          </h2>

          <button
            className="close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form
          className="form"
          onSubmit={submit}
        >

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              placeholder={
                type ===
                "countries"
                  ? "Country name"
                  : type ===
                    "hospitals"
                  ? "Hospital name"
                  : type ===
                    "departments"
                  ? "Department name"
                  : "ICU name"
              }

              required
            />

          </div>


          {type ===
            "countries" && (

            <div className="form-group">

              <label>
                Country Code
              </label>

              <input
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .toUpperCase()
                  )
                }

                placeholder="e.g. ZAF"
              />

            </div>

          )}


          {type ===
            "hospitals" && (

            <>

              <div className="form-group">

                <label>
                  Country
                </label>

                <select
                  value={countryId}
                  onChange={(e) =>
                    setCountryId(
                      e.target.value
                    )
                  }

                  required
                >

                  <option value="">
                    Select country
                  </option>

                  {countries.map(
                    (country) => (

                      <option
                        key={
                          country.id
                        }

                        value={
                          country.id
                        }
                      >
                        {country.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Geographic
                  Location (Optional)
                </label>

                <div className="geo-instructions">

                  <strong>To add coordinates:</strong>
                  <br />
                  1. Copy the hospital name above
                  <br />
                  2. Search for it in{" "}
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Maps
                  </a>
                  <br />
                  3. Click on the location pin
                  <br />
                  4. Copy the latitude &amp; longitude
                  <br />
                  5. Paste the coordinates below

                </div>

              </div>


              <div className="form-group">

                <label>
                  Google Maps URL (Optional)
                </label>

                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) =>
                    setGoogleMapsUrl(
                      e.target.value
                    )
                  }

                  placeholder="https://maps.google.com/..."
                />

              </div>


              <div className="geo-inputs">

                <div className="form-group">

                  <label>
                    Latitude (15-20 decimals)
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(
                        e.target
                          .value === ""
                          ? ""
                          : parseFloat(
                              e.target
                                .value
                            )
                      )
                    }

                    placeholder="e.g. -33.924901234567890"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Longitude (15-20 decimals)
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(
                        e.target
                          .value === ""
                          ? ""
                          : parseFloat(
                              e.target
                                .value
                            )
                      )
                    }

                    placeholder="e.g. 18.424105678901234"
                  />

                </div>

              </div>


              {latitude !== "" &&
                longitude !== "" && (

                <div className="location-badge">

                  ✓ Location captured:
                  <br />
                  Lat: {latitude}
                  <br />
                  Lng: {longitude}

                </div>

              )}

            </>

          )}


          {type ===
            "departments" && (

            <div className="form-group">

              <label>
                Hospital
              </label>

              <select
                value={hospitalId}
                onChange={(e) =>
                  setHospitalId(
                    e.target.value
                  )
                }

                required
              >

                <option value="">
                  Select hospital
                </option>

                {hospitals.map(
                  (hospital) => (

                    <option
                      key={
                        hospital.id
                      }

                      value={
                        hospital.id
                      }
                    >
                      {hospital.name}
                    </option>

                  )
                )}

              </select>

            </div>

          )}


          {type ===
            "icus" && (

            <div className="form-group">

              <label>
                Department
              </label>

              <select
                value={
                  departmentId
                }

                onChange={(e) =>
                  setDepartmentId(
                    e.target.value
                  )
                }

                required
              >

                <option value="">
                  Select department
                </option>

                {departments.map(
                  (department) => (

                    <option
                      key={
                        department.id
                      }

                      value={
                        department.id
                      }
                    >
                      {department.name}
                    </option>

                  )
                )}

              </select>

            </div>

          )}


          <div className="actions">

            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* TABLES */

function CountryTable({
  countries,
}: {
  countries: Country[];
}) {

  if (countries.length === 0) {
    return (
      <EmptyState
        title="No countries configured"
        text="The administrator can add the first country to the registry."
      />
    );
  }


  return (
    <div className="table-container">

      <table>

        <thead>
          <tr>
            <th>
              Country
            </th>

            <th>
              Code
            </th>

            <th>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {countries.map(
            (country) => (

              <tr
                key={
                  country.id
                }
              >

                <td>
                  {country.name}
                </td>

                <td>
                  {country.code}
                </td>

                <td>

                  <div className="actions">

                    <button className="button secondary">
                      Edit
                    </button>

                    <button className="button danger">
                      Remove
                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}


function HospitalTable({
  hospitals,
  countries,
}: {
  hospitals: Hospital[];
  countries: Country[];
}) {

  if (
    hospitals.length === 0
  ) {

    return (
      <EmptyState
        title="No hospitals configured"
        text="Add a country first, then create participating hospitals."
      />
    );
  }


  return (
    <div className="table-container">

      <table>

        <thead>

          <tr>
            <th>
              Hospital
            </th>

            <th>
              Country
            </th>

            <th>
              Location
            </th>

            <th>
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {hospitals.map(
            (hospital) => {

              const country =
                countries.find(
                  (c) =>
                    c.id ===
                    hospital.countryId
                );

              return (

                <tr
                  key={
                    hospital.id
                  }
                >

                  <td>
                    {hospital.name}
                  </td>

                  <td>
                    {country?.name ??
                      "Unknown"}
                  </td>

                  <td>
                    {hospital
                      .latitude &&
                    hospital
                      .longitude ? (
                      <span className="location-badge">
                        📍 Lat: {hospital
                          .latitude}
                        <br />
                        Lng: {hospital
                          .longitude}
                      </span>
                    ) : (
                      <span
                        style={{
                          color:
                            "#999",
                        }}
                      >
                        Not set
                      </span>
                    )}
                  </td>

                  <td>

                    <div className="actions">

                      <button className="button secondary">
                        Edit
                      </button>

                    </div>

                  </td>

                </tr>

              );

            }
          )}

        </tbody>

      </table>

    </div>
  );
}


function DepartmentTable({
  departments,
  hospitals,
}: {
  departments: Department[];
  hospitals: Hospital[];
}) {

  if (
    departments.length === 0
  ) {

    return (
      <EmptyState
        title="No departments configured"
        text="Departments can be added under participating hospitals."
      />
    );
  }


  return (
    <div className="table-container">

      <table>

        <thead>

          <tr>
            <th>
              Department
            </th>

            <th>
              Hospital
            </th>

          </tr>

        </thead>

        <tbody>

          {departments.map(
            (department) => {

              const hospital =
                hospitals.find(
                  (h) =>
                    h.id ===
                    department.hospitalId
                );

              return (

                <tr
                  key={
                    department.id
                  }
                >

                  <td>
                    {department.name}
                  </td>

                  <td>
                    {hospital?.name ??
                      "Unknown"}
                  </td>

                </tr>

              );

            }
          )}

        </tbody>

      </table>

    </div>
  );
}


function ICUTable({
  icus,
  departments,
}: {
  icus: ICU[];
  departments: Department[];
}) {

  if (
    icus.length === 0
  ) {

    return (
      <EmptyState
        title="No ICU units configured"
        text="ICU units can be added under the appropriate department."
      />
    );
  }


  return (
    <div className="table-container">

      <table>

        <thead>

          <tr>
            <th>
              ICU
            </th>

            <th>
              Department
            </th>

          </tr>

        </thead>

        <tbody>

          {icus.map(
            (icu) => {

              const department =
                departments.find(
                  (d) =>
                    d.id ===
                    icu.departmentId
                );

              return (

                <tr
                  key={
                    icu.id
                  }
                >

                  <td>
                    {icu.name}
                  </td>

                  <td>
                    {department?.name ??
                      "Unknown"}
                  </td>

                </tr>

              );

            }
          )}

        </tbody>

      </table>

    </div>
  );
}


function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {

  return (

    <div className="empty">

      <strong>
        {title}
      </strong>

      {text}

    </div>

  );
}


/* PLACEHOLDER MODULES */

function Users() {

  return (
    <>
      <h1>
        Users & Permissions
      </h1>

      <p className="subtitle">
        User accounts and federated
        access will be configured
        here.
      </p>

      <div className="card">

        <EmptyState
          title="No users configured"
          text="The Super Administrator will create users and assign their access scope."
        />

      </div>
    </>
  );
}


function Patients() {

  return (
    <>
      <h1>
        Patient Registry
      </h1>

      <p className="subtitle">
        Patient records will appear
        here after data collection
        is enabled.
      </p>

      <div className="card">

        <EmptyState
          title="No patient records"
          text="Patient-level data will be stored in the secure database."
        />

      </div>
    </>
  );
}


function DataCollection() {

  return (
    <>
      <h1>
        Data Collection
      </h1>

      <p className="subtitle">
        Configurable clinical data
        collection forms.
      </p>

      <div className="card">

        <EmptyState
          title="No forms configured"
          text="The administrator will be able to create and publish data collection forms."
        />

      </div>
    </>
  );
}


function Validation() {

  return (
    <>
      <h1>
        Data Validation
      </h1>

      <p className="subtitle">
        Review and validation
        workflow.
      </p>

      <div className="card">

        <EmptyState
          title="No records awaiting validation"
          text="Submitted records requiring review will appear here."
        />

      </div>
    </>
  );
}


function Analytics({
  hospitals,
}: {
  hospitals: Hospital[];
}) {

  const hospitalsWithLocation =
    hospitals.filter(
      (h) =>
        h.latitude &&
        h.longitude
    );

  return (
    <>
      <h1>
        Analytics
      </h1>

      <p className="subtitle">
        Registry analytics and
        reporting.
      </p>

      <div className="metrics">

        <Metric
          title="Patients"
          value={0}
        />

        <Metric
          title="Admissions"
          value={0}
        />

        <Metric
          title="Validated"
          value={0}
        />

        <Metric
          title="Pending"
          value={0}
        />

      </div>

      <div className="card">

        <div className="card-title">
          Hospital Locations
        </div>

        {hospitalsWithLocation
          .length > 0 ? (

          <>

            <p style={{ fontSize: "14px" }}>
              {
                hospitalsWithLocation
                  .length
              }{" "}
              hospitals have
              location data.
            </p>

            <div className="map-container">

              📍 Map visualization
              will display{" "}
              {
                hospitalsWithLocation
                  .length
              }{" "}
              hospitals here
              (integrate Google Maps or
              Mapbox API)

            </div>

            <div
              style={{
                fontSize: "12px",

                color: "#666",

                padding: "10px",

                backgroundColor:
                  "#f9f9f9",

                borderRadius: "6px",
              }}
            >

              <strong>Hospitals with coordinates:</strong>
              <ul
                style={{
                  margin:
                    "10px 0 0 20px",

                  padding: 0,

                  fontFamily:
                    "'Courier New', monospace",

                  lineHeight: 1.6,
                }}
              >

                {
                  hospitalsWithLocation.map(
                    (h) => (

                      <li key={h.id}>

                        <strong>{h.name}</strong>
                        <br />
                        Lat: {h.latitude}
                        <br />
                        Lng: {h.longitude}

                      </li>

                    )
                  )
                }

              </ul>

            </div>

          </>

        ) : (

          <EmptyState
            title="No hospital locations recorded"
            text="Add hospital coordinates from the Organisation section to display them on the map."
          />

        )}

      </div>
    </>
  );
}
