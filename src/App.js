import React, { useState } from 'react';

const App = () => {
  const [employees, setEmployees] = useState('');
  const [layout, setLayout] = useState(null);
  const [seatingArrangement, setSeatingArrangement] = useState([]);

  // 직원 이름들을 배열로 파싱
  const parseEmployees = (input) => {
    return input
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  // 배열을 랜덤하게 섞는 함수
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 자리 배치 생성 함수
  const generateSeatingArrangement = (employeeList, rows, cols) => {
    const totalSeats = rows * cols;
    const shuffledEmployees = shuffleArray(employeeList);
    const arrangement = [];

    for (let i = 0; i < totalSeats; i++) {
      arrangement.push({
        id: i,
        employee: shuffledEmployees[i] || null,
        position: {
          row: Math.floor(i / cols),
          col: i % cols
        }
      });
    }

    return arrangement;
  };

  // 레이아웃 선택 및 자리 배치
  const handleLayoutSelect = (layoutType) => {
    const employeeList = parseEmployees(employees);
    
    if (employeeList.length === 0) {
      alert('직원 이름을 입력해주세요!');
      return;
    }

    let rows, cols;
    if (layoutType === '4x5') {
      rows = 5;
      cols = 4;
    } else if (layoutType === '6x4') {
      rows = 4;
      cols = 6;
    }

    const totalSeats = rows * cols;
    if (employeeList.length > totalSeats) {
      alert(`선택한 레이아웃(${layoutType})에는 최대 ${totalSeats}명까지만 배치할 수 있습니다. 현재 ${employeeList.length}명이 입력되었습니다.`);
      return;
    }

    setLayout({ type: layoutType, rows, cols });
    const arrangement = generateSeatingArrangement(employeeList, rows, cols);
    setSeatingArrangement(arrangement);
  };

  // 자리 재배치
  const handleShuffle = () => {
    if (!layout) return;
    
    const employeeList = parseEmployees(employees);
    const arrangement = generateSeatingArrangement(employeeList, layout.rows, layout.cols);
    setSeatingArrangement(arrangement);
  };

  const employeeList = parseEmployees(employees);

  return (
    <div className="app">
      <div className="header">
        <h1>🪑 랜덤 자리 배치 시스템</h1>
        <p>직원들의 이름을 입력하고 원하는 레이아웃을 선택하세요</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="employees">
            직원 이름 입력 (쉼표 또는 줄바꿈으로 구분)
          </label>
          <textarea
            id="employees"
            className="employee-input"
            placeholder="예시:&#10;김철수, 이영희, 박민수&#10;또는&#10;김철수&#10;이영희&#10;박민수"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
          />
        </div>

        {employeeList.length > 0 && (
          <div className="employee-count">
            입력된 직원 수: <strong>{employeeList.length}명</strong>
            <br />
            <small>{employeeList.join(', ')}</small>
          </div>
        )}

        <div className="layout-buttons">
          <button 
            className="layout-btn"
            onClick={() => handleLayoutSelect('4x5')}
            disabled={employeeList.length === 0}
          >
            크랙반 (20자리)
          </button>
          <button 
            className="layout-btn"
            onClick={() => handleLayoutSelect('6x4')}
            disabled={employeeList.length === 0}
          >
            리시반 (24자리)
          </button>
        </div>

        {employeeList.length > 0 && (
          <>
            {employeeList.length > 20 && (
              <div className="warning">
                ⚠️ 4×5 레이아웃의 최대 수용 인원(20명)을 초과했습니다. 6×4 레이아웃을 사용하세요.
              </div>
            )}
            {employeeList.length > 24 && (
              <div className="warning">
                ⚠️ 모든 레이아웃의 최대 수용 인원(24명)을 초과했습니다. 인원을 줄여주세요.
              </div>
            )}
          </>
        )}
      </div>

      {layout && seatingArrangement.length > 0 && (
        <div className="seating-display">
          <div className="seating-title">
            {layout.type} 자리 배치 ({layout.cols}×{layout.rows} = {layout.cols * layout.rows}자리)
          </div>
          
          <button 
            className="shuffle-btn"
            onClick={handleShuffle}
          >
            🔀 다시 섞기
          </button>

          <div className={`seating-grid grid-${layout.type}`}>
            {seatingArrangement.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.employee ? 'occupied' : 'empty'}`}
                title={seat.employee ? `${seat.employee} (${seat.position.row + 1}행 ${seat.position.col + 1}열)` : '빈 자리'}
              >
                {seat.employee || '빈 자리'}
              </div>
            ))}
          </div>

          <div className="employee-count">
            배치된 인원: <strong>{employeeList.length}명</strong> / 전체 자리: <strong>{layout.cols * layout.rows}개</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 